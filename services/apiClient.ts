
import { Category, Expense, Budget, UserProfile } from '../types';

const SIMULATED_DELAY = 600;
const DB_KEY = 'finance_flow_v2_db';

interface DB {
  users: (UserProfile & { password?: string })[];
  expenses: Expense[];
  budgets: Budget[];
}

const getDB = (): DB => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    const initialDB: DB = { users: [], expenses: [], budgets: [] };
    localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
    return initialDB;
  }
  return JSON.parse(data);
};

const saveDB = (db: DB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const apiClient = {
  // Explicitly return Promise<any> to prevent TypeScript from inferring a complex union 
  // of all possible return values, which causes type mismatches in the service layer.
  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    
    const db = getDB();
    const token = localStorage.getItem('token');
    const userId = token ? token.replace('token_', '') : null;
    const body = options.body ? JSON.parse(options.body as string) : null;

    // Authentication Routes
    if (endpoint === '/auth/register') {
      const { email, password } = body;
      const normalizedEmail = email.toLowerCase().trim();
      
      if (db.users.find(u => u.email?.toLowerCase() === normalizedEmail)) {
        throw new Error('This email is already associated with an account.');
      }
      
      const provider = normalizedEmail.includes('gmail.com') ? 'Gmail' : 
                       normalizedEmail.includes('yahoo.com') ? 'Yahoo Mail' : 'Email';

      const newUser: UserProfile & { password?: string } = { 
        uid: `u_${Date.now()}`, 
        email: normalizedEmail, 
        displayName: normalizedEmail.split('@')[0],
        emailVerified: false,
        password: password // In real world, we hash this.
      };

      db.users.push(newUser);
      saveDB(db);
      return { token: `token_${newUser.uid}`, user: newUser };
    }

    if (endpoint === '/auth/login') {
      const { email, password } = body;
      const user = db.users.find(u => 
        u.email?.toLowerCase() === email.toLowerCase().trim() && 
        u.password === password
      );
      
      if (!user) throw new Error('Incorrect email or password.');
      
      if (!user.emailVerified) {
        throw new Error('Please verify your account via the link sent from samuelirenikase@gmail.com.');
      }

      const { password: _, ...userWithoutPass } = user;
      return { token: `token_${user.uid}`, user: userWithoutPass };
    }

    if (endpoint === '/auth/verify-email') {
      const { email } = body;
      const userIndex = db.users.findIndex(u => u.email?.toLowerCase() === email.toLowerCase().trim());
      if (userIndex === -1) throw new Error('User not found.');
      
      db.users[userIndex].emailVerified = true;
      saveDB(db);
      return { success: true };
    }

    if (endpoint === '/auth/me') {
      if (!userId) throw new Error('Unauthorized');
      const user = db.users.find(u => u.uid === userId);
      if (!user) throw new Error('Unauthorized');
      const { password: _, ...userWithoutPass } = user;
      return userWithoutPass;
    }

    // Protected Routes (Require Authentication)
    if (!userId) throw new Error('Unauthorized');

    if (endpoint === '/expenses') {
      if (options.method === 'POST') {
        const newExpense: Expense = { ...body, id: `exp_${Date.now()}`, userId, createdAt: Date.now() };
        db.expenses.push(newExpense);
        saveDB(db);
        return newExpense;
      }
      return db.expenses
        .filter(e => e.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    if (endpoint.startsWith('/expenses/')) {
      const id = endpoint.split('/')[2];
      const index = db.expenses.findIndex(e => e.id === id && e.userId === userId);
      if (index === -1) throw new Error('Expense not found');

      if (options.method === 'PUT') {
        db.expenses[index] = { ...db.expenses[index], ...body };
        saveDB(db);
        return db.expenses[index];
      }
      if (options.method === 'DELETE') {
        db.expenses.splice(index, 1);
        saveDB(db);
        return { success: true };
      }
    }

    if (endpoint === '/budgets') {
      if (options.method === 'POST') {
        const { category, amount } = body;
        const index = db.budgets.findIndex(b => b.category === category && b.userId === userId);
        if (index !== -1) {
          db.budgets[index].amount = amount;
        } else {
          db.budgets.push({ id: `bud_${Date.now()}`, userId, category, amount });
        }
        saveDB(db);
        return db.budgets.find(b => b.category === category && b.userId === userId);
      }
      return db.budgets.filter(b => b.userId === userId);
    }

    throw new Error(`Route ${endpoint} not found`);
  }
};
