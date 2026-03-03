import { useState } from 'react';
import OrderCard from '../components/OrderCard';

const INITIAL_ORDERS = [
    { id: 1, table: 'T-04', name: 'Pad Kra Pao Moo Krob', notes: 'Extra spicy, fried egg over medium', time: '5 mins ago', status: 'todo' },
    { id: 2, table: 'T-09', name: 'Tom Yum Goong', notes: 'No cilantro', time: '12 mins ago', status: 'todo' },
    { id: 3, table: 'T-01', name: 'Green Curry Chicken', notes: '', time: '15 mins ago', status: 'progress' },
    { id: 4, table: 'T-11', name: 'Mango Sticky Rice', notes: 'Extra coconut milk', time: '2 mins ago', status: 'todo' },
    { id: 5, table: 'T-03', name: 'Pad Thai Shrimp', notes: 'No peanuts', time: '25 mins ago', status: 'done' },
];

export default function QueuePage() {
    const [orders, setOrders] = useState(INITIAL_ORDERS);

    const changeStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const todoOrders = orders.filter(o => o.status === 'todo');
    const progressOrders = orders.filter(o => o.status === 'progress');
    const doneOrders = orders.filter(o => o.status === 'done');

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Kitchen Queue</h1>
                    <p className="page-subtitle">Manage incoming orders dynamically</p>
                </div>
            </header>

            <div className="queue-board">
                {/* To Do Column */}
                <div className="queue-column">
                    <div className="queue-column-header state-todo">
                        <h2>ยังไม่ได้ทำ <span className="text-muted text-sm font-normal ml-1">(To Do)</span></h2>
                        <span className="badge">{todoOrders.length}</span>
                    </div>
                    <div className="queue-list">
                        {todoOrders.length === 0 ? (
                            <div className="empty-state">No pending orders</div>
                        ) : (
                            todoOrders.map(order => (
                                <OrderCard key={order.id} order={order} onChangeStatus={changeStatus} />
                            ))
                        )}
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="queue-column">
                    <div className="queue-column-header state-progress">
                        <h2>กำลังทำ <span className="text-muted text-sm font-normal ml-1">(In Progress)</span></h2>
                        <span className="badge">{progressOrders.length}</span>
                    </div>
                    <div className="queue-list">
                        {progressOrders.length === 0 ? (
                            <div className="empty-state">No orders in progress</div>
                        ) : (
                            progressOrders.map(order => (
                                <OrderCard key={order.id} order={order} onChangeStatus={changeStatus} />
                            ))
                        )}
                    </div>
                </div>

                {/* Done Column */}
                <div className="queue-column">
                    <div className="queue-column-header state-done">
                        <h2>เสร็จแล้ว <span className="text-muted text-sm font-normal ml-1">(Done)</span></h2>
                        <span className="badge">{doneOrders.length}</span>
                    </div>
                    <div className="queue-list">
                        {doneOrders.length === 0 ? (
                            <div className="empty-state">No completed orders</div>
                        ) : (
                            doneOrders.map(order => (
                                <OrderCard key={order.id} order={order} onChangeStatus={changeStatus} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
