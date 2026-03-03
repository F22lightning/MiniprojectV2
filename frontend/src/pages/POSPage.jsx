import { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, Send, Utensils, ShoppingCart } from 'lucide-react';
import { fetchMenus, createOrder } from '../api';

export default function POSPage() {
    const [menus, setMenus] = useState([]);
    const [cart, setCart] = useState([]);
    const [queueNo, setQueueNo] = useState(1);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        // Load available menus
        const loadMenus = async () => {
            try {
                const data = await fetchMenus();
                setMenus(data);
            } catch (error) {
                console.error("Failed to load menus for POS", error);
            }
        };
        loadMenus();
    }, []);

    const addToCart = (menu) => {
        setCart(prev => {
            const existing = prev.find(item => item.ID_เมนู === menu.ID_เมนู);
            if (existing) {
                return prev.map(item => item.ID_เมนู === menu.ID_เมนู ? { ...item, จำนวน: item.จำนวน + 1 } : item);
            }
            return [...prev, { ...menu, จำนวน: 1, หมายเหตุ_คำสั่งพิเศษ: '' }];
        });
    };

    const updateQuantity = (menuId, change) => {
        setCart(prev => prev.map(item => {
            if (item.ID_เมนู === menuId) {
                const newQty = Math.max(0, item.จำนวน + change);
                return { ...item, จำนวน: newQty };
            }
            return item;
        }).filter(item => item.จำนวน > 0));
    };

    const updateNote = (menuId, note) => {
        setCart(prev => prev.map(item => item.ID_เมนู === menuId ? { ...item, หมายเหตุ_คำสั่งพิเศษ: note } : item));
    };

    const handleSubmitOrder = async () => {
        if (cart.length === 0) return;

        setLoading(true);
        try {
            const orderData = {
                คิวที่: queueNo,
                items: cart.map(item => ({
                    ID_เมนู: item.ID_เมนู,
                    จำนวน: item.จำนวน,
                    หมายเหตุ_คำสั่งพิเศษ: item.หมายเหตุ_คำสั่งพิเศษ
                }))
            };

            await createOrder(orderData);

            // Reset
            setCart([]);
            setQueueNo(prev => prev + 1);

            // Notify
            setNotification(`ส่งออเดอร์คิวที่ ${queueNo} ไปยังครัวแล้ว!`);
            setTimeout(() => setNotification(''), 3000);

        } catch (error) {
            alert("Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6">

            {/* Menu Area */}
            <div className="flex-[2] bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-hidden">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Utensils className="w-6 h-6 text-emerald-500" />
                        รายการอาหาร
                    </h2>
                    <p className="text-slate-500">แตะที่เมนูเพื่อเพิ่มลงในรายการสั่งซื้อ</p>
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                    {menus.map(menu => (
                        <button
                            key={menu.ID_เมนู}
                            onClick={() => addToCart(menu)}
                            className="bg-emerald-50 hover:bg-emerald-100 hover:shadow-md transition-all active:scale-95 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 h-32"
                        >
                            <span className="font-bold text-slate-800 leading-tight">{menu.ชื่อเมนู}</span>
                            <span className="text-xs font-semibold px-2 py-1 bg-white text-emerald-600 rounded-full">{menu.ชื่อหมวดหมู่}</span>
                        </button>
                    ))}
                    {menus.length === 0 && (
                        <div className="col-span-full py-10 text-center text-slate-400">กำลังโหลดเมนูอาหาร...</div>
                    )}
                </div>
            </div>

            {/* Cart Area */}
            <div className="flex-1 min-w-[320px] max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-0 flex flex-col h-full">
                {/* Cart Header */}
                <div className="p-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">ออเดอร์ปัจจุบัน</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm font-semibold">คิวที่</span>
                        <input
                            type="number"
                            value={queueNo}
                            onChange={e => setQueueNo(parseInt(e.target.value) || 1)}
                            className="w-16 border border-slate-200 rounded-md p-1 text-center font-bold text-lg"
                            min="1"
                        />
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <ShoppingCart className="w-12 h-12 mb-3 opacity-20" />
                            <p>ยังไม่มีเมนูในออเดอร์</p>
                        </div>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-slate-800 pr-2">{item.ชื่อเมนู}</div>
                                    <button onClick={() => updateQuantity(item.ID_เมนู, -item.จำนวน)} className="text-red-400 hover:text-red-600 p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                                        <button onClick={() => updateQuantity(item.ID_เมนู, -1)} className="p-2 hover:bg-slate-100 text-slate-600">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-bold">{item.จำนวน}</span>
                                        <button onClick={() => updateQuantity(item.ID_เมนู, 1)} className="p-2 hover:bg-slate-100 text-slate-600">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="ระบุหมายเหตุ (เช่น ไม่เผ็ด)"
                                        value={item.หมายเหตุ_คำสั่งพิเศษ}
                                        onChange={(e) => updateNote(item.ID_เมนู, e.target.value)}
                                        className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Checkout Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
                    {notification && (
                        <div className="mb-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 py-2 px-3 rounded-lg text-center font-medium animate-pulse">
                            {notification}
                        </div>
                    )}
                    <button
                        onClick={handleSubmitOrder}
                        disabled={cart.length === 0 || loading}
                        className={`w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm
              ${cart.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'}
            `}
                    >
                        {loading ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span> : <Send className="w-5 h-5" />}
                        {loading ? 'กำลังส่งออเดอร์...' : 'ยืนยันและส่งเข้าครัว'}
                    </button>
                </div>
            </div>

        </div>
    );
}
