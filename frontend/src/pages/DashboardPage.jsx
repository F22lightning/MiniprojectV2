import { useState, useEffect } from 'react';
import { fetchStats } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, LayoutDashboard, Clock, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
        const interval = setInterval(loadStats, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    if (loading && !stats) return <div className="p-10 text-center text-slate-500">Loading Dashboard...</div>;
    if (!stats) return <div className="p-10 text-center text-red-500">Failed to load statistics</div>;

    return (
        <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2 pb-10">

            <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard className="w-8 h-8 text-emerald-500" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">แดชบอร์ดสรุปยอด (Dashboard)</h1>
                    <p className="text-slate-500">ข้อมูลสถิติประจำวันที่ {stats.today}</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500 font-semibold">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        ออเดอร์ทั้งหมด
                    </div>
                    <div className="text-4xl font-black text-slate-800">{stats.total_orders || 0} <span className="text-lg font-medium text-slate-400">รายการ</span></div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500 font-semibold">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ออเดอร์ที่เสร็จสิ้น
                    </div>
                    <div className="text-4xl font-black text-emerald-600">{stats.completed_orders || 0} <span className="text-lg font-medium text-emerald-400/70">รายการ</span></div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500 font-semibold">
                        <Clock className="w-5 h-5 text-amber-500" />
                        เทียบเวลาเฉลี่ย (นาที)
                    </div>
                    <div className="text-sm text-slate-500 mt-2">ดูรายละเอียดเวลาในกราฟด้านล่างเพื่อเทียบกับ SOP</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96 min-h-[400px]">
                {/* Best Sellers Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">🏆 เมนูขายดี 5 อันดับแรก</h3>
                    <div className="flex-1 min-h-0">
                        {stats.bestSellers && stats.bestSellers.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.bestSellers}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="ชื่อเมนู" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} />
                                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="total_sold" name="จำนวน (จาน/แก้ว)" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">ยังไม่มีข้อมูลการขายในวันนี้</div>
                        )}
                    </div>
                </div>

                {/* Cook Time Comparison Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">⏱️ ประสิทธิภาพเวลาการเตรียมอาหาร</h3>
                    <div className="flex-1 min-h-0">
                        {stats.timingStats && stats.timingStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.timingStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="ชื่อเมนู" tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} />
                                    <Legend />
                                    <Bar dataKey="sop_time" name="เวลามาตรฐาน SOP (นาที)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="avg_actual_time" name="เวลาที่ทำจริงเฉลี่ย (นาที)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">ยังไม่มีข้อมูลเวลาเนื่องจากยังไม่มีออเดอร์ที่เสร็จสมบูรณ์ร้อยเปอร์เซ็นต์</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
