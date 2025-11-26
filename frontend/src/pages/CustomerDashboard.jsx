import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

const CustomerDashboard = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [amount, setAmount] = useState('');

    const fetchData = async () => {
        try {
            const res = await api.get('/transactions/history');
            setBalance(res.data.balance);
            setTransactions(res.data.transactions);
        } catch (error) {
            toast.error('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTransaction = async (type) => {
        try {
            const endpoint = type === 'deposit' ? '/transactions/deposit' : '/transactions/withdraw';
            await api.post(endpoint, { amount: parseFloat(amount) });
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} successful`);
            setAmount('');
            if (type === 'deposit') setIsDepositOpen(false);
            else setIsWithdrawOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white shadow-lg mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Wallet size={32} />
                    <h2 className="text-2xl font-semibold">Available Balance</h2>
                </div>
                <p className="text-5xl font-bold">${parseFloat(balance).toFixed(2)}</p>
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={() => setIsDepositOpen(true)}
                        className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        <ArrowUpCircle /> Deposit
                    </button>
                    <button
                        onClick={() => setIsWithdrawOpen(true)}
                        className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                    >
                        <ArrowDownCircle /> Withdraw
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance After</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transactions.map((tx) => (
                                <tr key={tx.account_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.transaction_type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {tx.transaction_type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                        ${parseFloat(tx.amount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${parseFloat(tx.balance_after).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} title="Deposit Funds">
                <div className="space-y-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <button
                        onClick={() => handleTransaction('deposit')}
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        Confirm Deposit
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} title="Withdraw Funds">
                <div className="space-y-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <button
                        onClick={() => handleTransaction('withdraw')}
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        Confirm Withdrawal
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default CustomerDashboard;
