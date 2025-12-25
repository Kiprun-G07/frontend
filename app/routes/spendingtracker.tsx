import { useEffect, useState } from "react";
import { apiFetch } from "~/lib/auth";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

export function meta() {
    return [{ title: "Spending Tracker" }];
}

type NewExpense = {
    description: string;
    amount: number;
    spending_type_id: number;
};

type SpendingType = {
    id: number;
    name: string;
};

type Expense = {
    id: number;
    description: string;
    amount: number;
    spending_type: SpendingType;
    date: string;
};

type ExpenseByType = {
    spending_type_id: number;
    total_amount: number;
    spending_type: SpendingType;
}

type ExpenseSummary = {
    date: string;
    total_amount: number;
}

export default function SpendingTrackerPage() {

    const navigation = useNavigate();

    const [adding, setAdding] = useState(false);
    const [newExpense, setNewExpense] = useState<NewExpense>({ description: "", amount: 0, spending_type_id: 0 });

    const [spendingTypes, setSpendingTypes] = useState<SpendingType[]>([]);
    const [thisMonthsExpenses, setThisMonthsExpenses] = useState<ExpenseSummary[]>([]);
    const [thisMonthExpenseTotal, setThisMonthExpenseTotal] = useState(0);
    const [expensesByType, setExpensesByType] = useState<ExpenseByType[]>([]);
    const [todayExpenseTotal, setTodayExpenseTotal] = useState(0);
    const [todayExpenses, setTodayExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const res = await apiFetch('/api/spendings/types');
            if (!mounted) return;
            if (res.ok) {
                const data = await res.json();
                setSpendingTypes(data);
            }
        })();
        (async () => {
            const res = await apiFetch('/api/spendings/total');
            if (!mounted) return;
            if (res.ok) {
                const data = await res.json();
                setThisMonthExpenseTotal(data.total_amount);
            }
        })();
        (async () => {
            const res = await apiFetch('/api/spendings/by-type');
            if (!mounted) return;
            if (res.ok) {
                const data = await res.json();
                setExpensesByType(data);
            }
        })();
        (async () => {
            const res = await apiFetch('/api/spendings/today');
            if (!mounted) return;
            if (res.ok) {
                const data = await res.json();
                setTodayExpenseTotal(data.total);
                setTodayExpenses(data.spendings);
            }
        })();
        (async () => {
            const res = await apiFetch('/api/spendings/monthly-summary');
            if (!mounted) return;
            if (res.ok) {
                const data = await res.json();
                setThisMonthsExpenses(data);
            }
        })();
        
        return () => { mounted = false };
    }, []);

    function addExpense() {
        apiFetch('/api/spendings/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newExpense)
        }).then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                // Refresh the page to show the new expense
                navigation(0);
            }
        });
    }

    ChartJS.register(ArcElement, Tooltip, Legend);

    return (
        <div className="p-8 w-full">
            <h1 className="text-2xl font-bold mb-4">Spending Tracker</h1>
            {/* Grid of 3, 1 for the month's spending summary, one for todays spending, one for everyday of the month */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white-100 bg-opacity-25 p-5 rounded-xl shadow-lg inset-shadow-sm inset-shadow-black-600">
                    <h2 className="text-sm text-gray-600 font-semibold mb-2">This Month's Summary</h2>
                    <h1 className="text-5xl font-bold mb-4">RM{thisMonthExpenseTotal}</h1>

                    <Doughnut
                        data={{
                            labels: expensesByType.map(ebt => ebt.spending_type.name),
                            datasets: [{
                                data: expensesByType.map(ebt => ebt.total_amount),
                                backgroundColor: [
                                    '#FF6384',
                                    '#36A2EB',
                                    '#FFCE56',
                                    '#4BC0C0',
                                    '#9966FF',
                                    '#FF9F40',
                                ],
                            }]
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom' as const,
                                },
                            },
                            //border width: 1,
                            elements: {
                                arc: {
                                    borderWidth: 0.5,
                                }
                            }
                        }}
                    />

                    <div>
                        {expensesByType && expensesByType.map(expenseType => (
                            <div key={expenseType.spending_type_id} className="flex justify-between mt-2">
                                <div className="text-gray-700">{expenseType.spending_type.name}</div>
                                <div className="font-semibold">RM{expenseType.total_amount}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white-100 bg-opacity-25 p-5 rounded-xl shadow-lg inset-shadow-sm inset-shadow-black-600">
                    <h2 className="text-sm font-semibold mb-2">Today's Spending</h2>
                    <p>Total Spending Today: RM{todayExpenseTotal}</p>
                    <div className="pt-2">
                        { adding ? (
                            <div className="mt-2">
                                <form className="flex flex-col" onSubmit={(e) => {
                                    e.preventDefault();
                                    addExpense();
                                    setAdding(false);
                                }}>
                                    <select required className="appearance-none bg-white-300 bg-opacity-25 shadow-lg inset-shadow-sm inset-shadow-black-600 text-gray-500 px-3 py-1 rounded-xl w-full mb-2" onChange={(e) => { setNewExpense({...newExpense, spending_type_id: parseInt(e.target.value) || 0}) }}>
                                        <option value="">Select Spending Type</option>
                                        {spendingTypes && spendingTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                    <input required type="text" placeholder="Item Description" className="bg-white-300 bg-opacity-25 shadow-lg inset-shadow-sm inset-shadow-black-600 text-gray-500 px-3 py-1 rounded-xl w-full mb-2" onChange={(e) => setNewExpense({...newExpense, description: e.target.value})} />
                                    <input required step="0.01" type="number" placeholder="Amount" className="bg-white-300 bg-opacity-25 shadow-lg inset-shadow-sm inset-shadow-black-600 text-gray-500 px-3 py-1 rounded-xl w-full mb-2" onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})} />
                                    <div className="flex gap-2">
                                        <input type="submit" className="bg-blue-600 text-white px-3 py-1 rounded" value="Save" />
                                        <button className="bg-gray-300 text-black px-3 py-1 rounded" onClick={() => setAdding(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <button className="mt-2 bg-white-300 bg-opacity-25 shadow-lg inset-shadow-sm inset-shadow-black-600 text-gray-500 px-3 py-1 rounded-xl" onClick={() => setAdding(true)}>Add Expense</button>
                        ) }
                    </div>
                    <div className="mt-4">
                        {todayExpenses && todayExpenses.map(expense => (
                            <div key={expense.id} className="flex justify-between border-b border-gray-300 py-2">
                                <div>
                                    <div className="font-semibold">{expense.description}</div>
                                    <div className="text-sm text-gray-500">{expense.spending_type.name}</div>
                                </div>
                                <div className="font-semibold">RM{expense.amount}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white-100 bg-opacity-25 p-5 rounded-xl shadow-lg inset-shadow-sm inset-shadow-black-600">
                    <h2 className="text-sm font-semibold mb-2">Daily Spending Overview</h2>
                    
                    {thisMonthsExpenses.length === 0 ? (
                        <p>No expenses recorded for this month.</p>
                    ) : thisMonthsExpenses.map(expense => (
                        <div className="flex justify-between border-b border-gray-300 py-2">
                            <div className="font-semibold">{dayjs(expense.date).format('MMMM D, YYYY')}</div>
                            <div className="font-semibold">RM{expense.total_amount}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}