import { useEffect, useState } from 'react';
import OrderBoard from '../components/OrderBoard';

export default function KDSPage() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Kitchen Display System (KDS)</h1>
                    <p className="text-slate-500">จัดการคิวและสถานะการทำอาหาร</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 font-mono text-lg font-bold text-slate-700">
                    {currentTime.toLocaleTimeString('th-TH')}
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <OrderBoard />
            </div>
        </div>
    );
}
