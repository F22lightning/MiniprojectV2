import { useState, useEffect } from 'react';
import { fetchOrderHistory } from '../api';
import { differenceInMinutes, format } from 'date-fns';
import { History, Search, FileDown } from 'lucide-react';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchOrderHistory();
                setHistory(data);
            } catch (error) {
                console.error("Failed to load order history", error);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    const filteredHistory = history.filter(order =>
        order.คิวที่.toString().includes(searchTerm) ||
        order.items.some(item => item.ชื่อเมนู.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col gap-6">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <History className="w-8 h-8 text-blue-500" />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">ประวัติออเดอร์ (Order History)</h1>
                        <p className="text-slate-500">ดูรายการที่เสร็จสิ้นไปแล้ว 50 ออเดอร์ล่าสุด</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาคิว หรือ ชื่อเมนู..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1 h-full">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600 border-b border-slate-200 w-24">คิวที่</th>
                                <th className="p-4 font-semibold text-slate-600 border-b border-slate-200">รายการเมนู</th>
                                <th className="p-4 font-semibold text-slate-600 border-b border-slate-200 w-40 text-center">เวลาที่สั่ง</th>
                                <th className="p-4 font-semibold text-slate-600 border-b border-slate-200 w-40 text-center">เวลาเสร็จสิ้น</th>
                                <th className="p-4 font-semibold text-slate-600 border-b border-slate-200 w-32 justify-center flex">ระยะเวลา (นาที)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="p-10 text-center text-slate-400">กำลังโหลดประวัติ...</td></tr>
                            ) : filteredHistory.length === 0 ? (
                                <tr><td colSpan="5" className="p-10 text-center text-slate-400">ไม่พบประวัติออเดอร์ หรือยังไม่มีออเดอร์ที่ดำเนินการเสร็จสิ้น</td></tr>
                            ) : (
                                filteredHistory.map(order => {
                                    const startTime = order.เวลาที่เริ่มทำ ? new Date(order.เวลาที่เริ่มทำ) : new Date(order.วันที่เวลา_สั่ง);
                                    const endTime = new Date(order.เวลาที่เสร็จสิ้น);
                                    const dtMinutes = differenceInMinutes(endTime, startTime);

                                    return (
                                        <tr key={order.ID_ออเดอร์} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-4 font-black text-lg text-slate-800">#{order.คิวที่}</td>
                                            <td className="p-4">
                                                <ul className="space-y-1">
                                                    {order.items.map((item, idx) => (
                                                        <li key={idx} className="flex gap-2 items-start text-sm">
                                                            <span className="font-bold text-slate-600">{item.จำนวน}x</span>
                                                            <span className="text-slate-800 font-medium">{item.ชื่อเมนู}</span>
                                                            {item.หมายเหตุ_คำสั่งพิเศษ && (
                                                                <span className="text-amber-600 bg-amber-50 px-1.5 rounded text-xs">*{item.หมายเหตุ_คำสั่งพิเศษ}</span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="p-4 text-center text-sm text-slate-600">
                                                {format(new Date(order.วันที่เวลา_สั่ง), 'HH:mm:ss')}
                                            </td>
                                            <td className="p-4 text-center text-sm text-slate-600">
                                                {format(endTime, 'HH:mm:ss')}
                                            </td>
                                            <td className="p-4">
                                                <div className={`mx-auto w-fit px-3 py-1 rounded-full text-xs font-bold ${dtMinutes <= 15 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {dtMinutes} นาที
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
