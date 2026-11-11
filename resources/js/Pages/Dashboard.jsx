import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SummaryCards from '@/Components/Dashboard/SummaryCards';
import TransactionList from '@/Components/Dashboard/TransactionList';
import TransactionModal from '@/Components/Dashboard/TransactionModal';
import TransactionDetailModal from '@/Components/Transaction/TransactionDetailModal';
import DeleteConfirmModal from '@/Components/Dashboard/DeleteConfirmModal';
import { PlusCircleDuotone } from '@/Components/Icons/PhosphorDuotone';
import { formatToday } from '@/Utils/format';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

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
    const [detailTransaction, setDetailTransaction] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingTransaction, setDeletingTransaction] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('open_tx') === '1') {
                setEditingTransaction(null);
                setIsModalOpen(true);
                params.delete('open_tx');
                const cleanUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
                window.history.replaceState({}, '', cleanUrl);
            }
        }
    }, []);

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
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00105B] dark:text-zinc-300">
                            <span className="w-2 h-2 rounded-full bg-[#00105B] dark:bg-zinc-300 animate-pulse" />
                            <span>{formatToday()}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                            Selamat Datang, {firstName}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                            Pantau dan kendalikan seluruh arus kas finansialmu dengan presisi.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            data-tour="dashboard-add-tx"
                            onClick={handleOpenCreate}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#00105B] hover:bg-[#000B42] dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-[#00105B]/25 dark:shadow-black/40 transition-all duration-200 focus:outline-none"
                        >
                            <PlusCircleDuotone className="w-4 h-4" />
                            <span>Tambah Transaksi Baru</span>
                        </button>
                    </div>
                </div>

                {/* Financial Summary Cards */}
                <div data-tour="dashboard-summary">
                    <SummaryCards metrics={metrics} />
                </div>

                {/* Transaction History (Today Only, Clickable for Detail) & Filters */}
                <div data-tour="dashboard-tx-list">
                    <TransactionList
                        transactions={transactions}
                        allTransactions={all_transactions.length > 0 ? all_transactions : (transactions.data || [])}
                        wallets={wallets}
                        filters={filters}
                        categories={categories}
                        onlyToday={true}
                        onAddNew={handleOpenCreate}
                        onSelect={setDetailTransaction}
                        onEdit={handleOpenEdit}
                        onDelete={handleOpenDelete}
                    />
                </div>
            </div>

            {/* Create / Edit Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transactionToEdit={editingTransaction}
                wallets={wallets}
                categories={categories}
            />

            {/* Detailed Transaction View Modal */}
            <TransactionDetailModal
                isOpen={Boolean(detailTransaction)}
                onClose={() => setDetailTransaction(null)}
                transaction={detailTransaction}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
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
