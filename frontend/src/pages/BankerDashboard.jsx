import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Search, User } from 'lucide-react';

const BankerDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerTransactions, setCustomerTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        const filtered = customers.filter(c =>
            c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCustomers(filtered);
    }, [searchTerm, customers]);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/users/customers');
            setCustomers(res.data);
            setFilteredCustomers(res.data);
        } catch (error) {
            toast.error('Failed to fetch customers');
        }
    };

    const viewTransactions = async (customer) => {
        try {
            const res = await api.get(`/users/customers/${customer.id}/transactions`);
            setSelectedCustomer(customer);
            setCustomerTransactions(res.data.transactions);
            setIsModalOpen(true);
        } catch (error) {
            toast.error('Failed to fetch transactions');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Banker Dashboard</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map((customer) => (
                    <div
                        key={customer.id}
                        onClick={() => viewTransactions(customer)}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-100 p-3 rounded-full text-primary">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{customer.username}</h3>
                                <p className="text-sm text-gray-500">{customer.email}</p>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-500">Current Balance</p>
                            <p className="text-2xl font-bold text-gray-800">${parseFloat(customer.balance || 0).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Transactions: ${selectedCustomer?.username}`}
            >
                <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {customerTransactions.map((tx) => (
                                <tr key={tx.account_id}>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.transaction_type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {tx.transaction_type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium">${parseFloat(tx.amount).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {customerTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-4 py-4 text-center text-gray-500">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    );
};

export default BankerDashboard;
