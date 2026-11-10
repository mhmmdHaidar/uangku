import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SummaryCards from '@/Components/Dashboard/SummaryCards';
import TransactionList from '@/Components/Dashboard/TransactionList';
import TransactionModal from '@/Components/Dashboard/TransactionModal';
import DeleteConfirmModal from '@/Components/Dashboard/DeleteConfirmModal';
import { PlusCircleDuotone } from '@/Components/Icons/PhosphorDuotone';
import { formatToday } from '@/Utils/format';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({
    auth,
    transactions,
    all_transactions = [],
    wallets = [],
    metrics,
    filters,
    categories = [],
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingTransaction, setDeletingTransaction] = useState(null);

    const handleOpenCreate = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleOpenDelete = (transaction) => {
        setDeletingTransaction(transaction);
        setIsDeleteOpen(true);
    };

    const firstName = auth.user.name.split(' ')[0];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Keuangan" />

            <div className="space-y-6">
                {/* Top Header: Date, Welcome Greeting & Add Transaction Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{formatToday()}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                            Selamat Datang, {firstName}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Pantau dan kendalikan seluruh arus kas finansialmu dengan presisi.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={handleOpenCreate}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/25 transition-all duration-200 focus:outline-none"
                        >
                            <PlusCircleDuotone className="w-4 h-4" />
                            <span>Tambah Transaksi Baru</span>
                        </button>
                    </div>
                </div>

                {/* Financial Summary Cards */}
                <SummaryCards metrics={metrics} />

                {/* Transaction History & Filters */}
                <TransactionList
                    transactions={transactions}
                    allTransactions={all_transactions.length > 0 ? all_transactions : (transactions.data || [])}
                    wallets={wallets}
                    filters={filters}
                    categories={categories}
                    onAddNew={handleOpenCreate}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                />
            </div>

            {/* Create / Edit Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transactionToEdit={editingTransaction}
                wallets={wallets}
                categories={categories}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                transaction={deletingTransaction}
            />
        </AuthenticatedLayout>
    );
}
