export const monthlyData = [
  { month: "Jan", income: 8500, expenses: 5200 },
  { month: "Feb", income: 9200, expenses: 4800 },
  { month: "Mar", income: 7800, expenses: 6100 },
  { month: "Apr", income: 10500, expenses: 5500 },
  { month: "May", income: 9800, expenses: 4900 },
  { month: "Jun", income: 11200, expenses: 5800 },
  { month: "Jul", income: 10800, expenses: 6200 },
  { month: "Aug", income: 12500, expenses: 5900 },
  { month: "Sep", income: 11800, expenses: 6400 },
  { month: "Oct", income: 13200, expenses: 7100 },
  { month: "Nov", income: 12800, expenses: 6800 },
  { month: "Dec", income: 14500, expenses: 8200 },
];

export const weeklySpending = [
  { day: "Mon", amount: 124 },
  { day: "Tue", amount: 89 },
  { day: "Wed", amount: 210 },
  { day: "Thu", amount: 67 },
  { day: "Fri", amount: 342 },
  { day: "Sat", amount: 189 },
  { day: "Sun", amount: 98 },
];

export const expenseCategories = [
  { name: "Housing", value: 1800, color: "#3B82F6", icon: "HS", budget: 2000 },
  { name: "Food & Dining", value: 650, color: "#10B981", icon: "FD", budget: 700 },
  { name: "Transport", value: 420, color: "#F59E0B", icon: "TR", budget: 500 },
  { name: "Entertainment", value: 280, color: "#8B5CF6", icon: "EN", budget: 300 },
  { name: "Healthcare", value: 340, color: "#EF4444", icon: "HC", budget: 400 },
  { name: "Shopping", value: 510, color: "#EC4899", icon: "SH", budget: 450 },
  { name: "Utilities", value: 230, color: "#06B6D4", icon: "UT", budget: 250 },
  { name: "Education", value: 180, color: "#F97316", icon: "ED", budget: 200 },
];

export const incomeSources = [
  { name: "Salary", value: 8500, color: "#10B981", icon: "SL", trend: +3.2 },
  { name: "Freelance", value: 2400, color: "#3B82F6", icon: "FL", trend: +12.5 },
  { name: "Investments", value: 1800, color: "#8B5CF6", icon: "IV", trend: -2.1 },
  { name: "Rental Income", value: 1200, color: "#F59E0B", icon: "RI", trend: 0 },
  { name: "Other", value: 600, color: "#EC4899", icon: "OT", trend: +5.8 },
];

export const transactions = [
  { id: 1, name: "Netflix Subscription", category: "Entertainment", amount: -15.99, date: "2024-12-15", type: "expense", status: "completed", merchant: "Netflix" },
  { id: 2, name: "Salary — Acme Corp", category: "Income", amount: 8500.00, date: "2024-12-14", type: "income", status: "completed", merchant: "Acme Corp" },
  { id: 3, name: "Whole Foods Market", category: "Food & Dining", amount: -134.50, date: "2024-12-13", type: "expense", status: "completed", merchant: "Whole Foods" },
  { id: 4, name: "Freelance — UI Project", category: "Income", amount: 2400.00, date: "2024-12-12", type: "income", status: "completed", merchant: "Client" },
  { id: 5, name: "Uber Ride", category: "Transport", amount: -24.80, date: "2024-12-12", type: "expense", status: "completed", merchant: "Uber" },
  { id: 6, name: "Amazon Purchase", category: "Shopping", amount: -89.99, date: "2024-12-11", type: "expense", status: "completed", merchant: "Amazon" },
  { id: 7, name: "Monthly Gym", category: "Healthcare", amount: -49.99, date: "2024-12-10", type: "expense", status: "completed", merchant: "Equinox" },
  { id: 8, name: "Dividend — AAPL", category: "Income", amount: 320.00, date: "2024-12-09", type: "income", status: "completed", merchant: "Brokerage" },
  { id: 9, name: "Electricity Bill", category: "Utilities", amount: -112.40, date: "2024-12-08", type: "expense", status: "completed", merchant: "Con Edison" },
  { id: 10, name: "Spotify Premium", category: "Entertainment", amount: -9.99, date: "2024-12-08", type: "expense", status: "completed", merchant: "Spotify" },
  { id: 11, name: "Online Course", category: "Education", amount: -179.00, date: "2024-12-07", type: "expense", status: "pending", merchant: "Udemy" },
  { id: 12, name: "Rent Payment", category: "Housing", amount: -1800.00, date: "2024-12-01", type: "expense", status: "completed", merchant: "Landlord" },
  { id: 13, name: "Freelance — App Dev", category: "Income", amount: 1850.00, date: "2024-11-28", type: "income", status: "completed", merchant: "Client" },
  { id: 14, name: "Whole Foods Market", category: "Food & Dining", amount: -98.20, date: "2024-11-27", type: "expense", status: "completed", merchant: "Whole Foods" },
  { id: 15, name: "Investment Return", category: "Income", amount: 540.00, date: "2024-11-25", type: "income", status: "completed", merchant: "Fidelity" },
];

export const budgets = [
  { category: "Housing", allocated: 2000, spent: 1800, color: "#3B82F6" },
  { category: "Food & Dining", allocated: 700, spent: 650, color: "#10B981" },
  { category: "Transport", allocated: 500, spent: 420, color: "#F59E0B" },
  { category: "Entertainment", allocated: 300, spent: 280, color: "#8B5CF6" },
  { category: "Healthcare", allocated: 400, spent: 340, color: "#EF4444" },
  { category: "Shopping", allocated: 450, spent: 510, color: "#EC4899" },
  { category: "Utilities", allocated: 250, spent: 230, color: "#06B6D4" },
  { category: "Education", allocated: 200, spent: 180, color: "#F97316" },
];

export const insights = [
  {
    id: 1,
    title: "Spending spike detected",
    desc: "Your shopping expenses are 13% over budget this month.",
    type: "warning",
    icon: "!",
  },
  {
    id: 2,
    title: "Savings milestone",
    desc: "You've saved $2,847 more than last month. Great momentum!",
    type: "success",
    icon: "✓",
  },
  {
    id: 3,
    title: "Investment opportunity",
    desc: "Based on your cash flow, you could invest $500 more monthly.",
    type: "info",
    icon: "i",
  },
  {
    id: 4,
    title: "Subscription audit",
    desc: "You have 7 active subscriptions totaling $142.94/month.",
    type: "neutral",
    icon: "•",
  },
];
