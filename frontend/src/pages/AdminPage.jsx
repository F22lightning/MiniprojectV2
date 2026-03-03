import { useState, useEffect } from 'react';
import { fetchMenus, fetchCategories, createMenu, deleteMenu, fetchCookingGuide, saveSOP } from '../api';
import { Settings, Plus, Trash2, Edit, Save, X, BookOpen } from 'lucide-react';

export default function AdminPage() {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for adding new menu
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [newMenu, setNewMenu] = useState({ ชื่อเมนู: '', ID_หมวดหมู่: '' });

    // State for editing SOP
    const [editingSopId, setEditingSopId] = useState(null);
    const [sopForm, setSopForm] = useState({ วิธีการทำ_สูตร: '', ลิงก์รูปภาพประกอบ: '', เวลามาตรฐาน_นาที: 5 });

    const loadData = async () => {
        setLoading(true);
        try {
            const [m, c] = await Promise.all([fetchMenus(), fetchCategories()]);
            setMenus(m);
            setCategories(c);
            if (c.length > 0) setNewMenu(prev => ({ ...prev, ID_หมวดหมู่: c[0].ID_หมวดหมู่ }));
        } catch (error) {
            console.error("Failed to load admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddMenu = async () => {
        if (!newMenu.ชื่อเมนู || !newMenu.ID_หมวดหมู่) return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        try {
            await createMenu(newMenu);
            setNewMenu({ ชื่อเมนู: '', ID_หมวดหมู่: categories[0].ID_หมวดหมู่ });
            setShowAddMenu(false);
            loadData();
        } catch (e) {
            alert('Failed to add menu');
        }
    };

    const handleDeleteMenu = async (id) => {
        if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้? ข้อมูล SOP และสถิติที่เกี่ยวข้องอาจได้รับผลกระทบ")) return;
        try {
            await deleteMenu(id);
            loadData();
        } catch (e) {
            alert('Failed to delete menu');
        }
    };

    const openSopEditor = async (menuId) => {
        setEditingSopId(menuId);
        try {
            const guide = await fetchCookingGuide(menuId);
            setSopForm({
                วิธีการทำ_สูตร: guide.วิธีการทำ_สูตร || '',
                ลิงก์รูปภาพประกอบ: guide.ลิงก์รูปภาพประกอบ || '',
                เวลามาตรฐาน_นาที: guide.เวลามาตรฐาน_นาที || 5
            });
        } catch (e) {
            // Guide not found, setup empty form
            setSopForm({ วิธีการทำ_สูตร: '', ลิงก์รูปภาพประกอบ: '', เวลามาตรฐาน_นาที: 5 });
        }
    };

    const handleSaveSop = async () => {
        try {
            await saveSOP(editingSopId, sopForm);
            setEditingSopId(null);
            alert('บันทึก SOP เรียบร้อยแล้ว');
        } catch (e) {
            alert('Failed to save SOP');
        }
    }

    if (loading && menus.length === 0) return <div className="p-10 text-center text-slate-500">Loading Admin...</div>;

    return (
        <div className="h-full flex flex-col gap-6 max-w-6xl mx-auto">

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Settings className="w-8 h-8 text-slate-700" />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">ระบบจัดการหลังบ้าน (Admin)</h1>
                        <p className="text-slate-500">จัดการรายการเมนู เพิ่ม ลบ และแก้ไขคู่มือทำอาหาร (SOP)</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                    {showAddMenu ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddMenu ? 'ยกเลิก' : 'เพิ่มเมนูใหม่'}
                </button>
            </div>

            {showAddMenu && (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-end shadow-inner mb-2">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-semibold text-emerald-800 mb-1">ชื่อเมนูอาหารใหม่</label>
                        <input
                            type="text"
                            className="w-full border border-emerald-200 rounded-lg px-4 py-2 outline-none focus:border-emerald-500"
                            placeholder="ระบุชื่อเมนู"
                            value={newMenu.ชื่อเมนู}
                            onChange={e => setNewMenu({ ...newMenu, ชื่อเมนู: e.target.value })}
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <label className="block text-sm font-semibold text-emerald-800 mb-1">หมวดหมู่</label>
                        <select
                            className="w-full border border-emerald-200 rounded-lg px-4 py-2 outline-none focus:border-emerald-500 bg-white"
                            value={newMenu.ID_หมวดหมู่}
                            onChange={e => setNewMenu({ ...newMenu, ID_หมวดหมู่: e.target.value })}
                        >
                            {categories.map(c => <option key={c.ID_หมวดหมู่} value={c.ID_หมวดหมู่}>{c.ชื่อหมวดหมู่}</option>)}
                        </select>
                    </div>
                    <button onClick={handleAddMenu} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold w-full md:w-auto transition-colors shadow-sm">
                        บันทึก
                    </button>
                </div>
            )}

            {/* Menus List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 sticky top-0">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600 border-b border-slate-200 w-16 text-center">ID</th>
                                <th className="p-4 font-semibold text-slate-600 border-b border-slate-200">ชื่อเมนู</th>
                                <th className="p-4 font-semibold text-slate-600 border-b border-slate-200">หมวดหมู่</th>
                                <th className="p-4 font-semibold text-slate-600 border-b border-slate-200 w-48 text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {menus.map(menu => (
                                <tr key={menu.ID_เมนู} className="hover:bg-slate-50/50">
                                    <td className="p-4 text-center text-slate-500 font-mono text-sm">{menu.ID_เมนู}</td>
                                    <td className="p-4 font-bold text-slate-700">{menu.ชื่อเมนู}</td>
                                    <td className="p-4 text-emerald-600 font-medium text-sm">{menu.ชื่อหมวดหมู่}</td>
                                    <td className="p-4 flex gap-2 justify-center">
                                        <button
                                            onClick={() => openSopEditor(menu.ID_เมนู)}
                                            className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors border border-blue-100"
                                        >
                                            <BookOpen className="w-4 h-4" /> SOP
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMenu(menu.ID_เมนู)}
                                            className="bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1.5 rounded-md transition-colors border border-red-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SOP Editor Modal */}
            {editingSopId && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                แก้ไขคู่มือการทำอาหาร (SOP)
                            </h3>
                            <button onClick={() => setEditingSopId(null)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">เวลามาตรฐาน (นาที)</label>
                                <input
                                    type="number"
                                    value={sopForm.เวลามาตรฐาน_นาที}
                                    onChange={e => setSopForm({ ...sopForm, เวลามาตรฐาน_นาที: parseInt(e.target.value) || 0 })}
                                    className="w-full md:w-48 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-blue-500 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">ลิงก์รูปภาพประกอบ (URL)</label>
                                <input
                                    type="text"
                                    value={sopForm.ลิงก์รูปภาพประกอบ}
                                    onChange={e => setSopForm({ ...sopForm, ลิงก์รูปภาพประกอบ: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-blue-500 font-mono text-sm"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">ขั้นตอนการทำ (วิธีการทำ_สูตร)</label>
                                <p className="text-xs text-slate-500 mb-2">ขึ้นบรรทัดใหม่ด้วยปุ่ม Enter ระบบจะแสดงเป็นข้อๆ ให้เอง</p>
                                <textarea
                                    value={sopForm.วิธีการทำ_สูตร}
                                    onChange={e => setSopForm({ ...sopForm, วิธีการทำ_สูตร: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 min-h-[200px] leading-relaxed"
                                    placeholder="1. เตรียมส่วนผสม...&#10;2. ตั้งกระทะ..."
                                />
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => setEditingSopId(null)}
                                className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSaveSop}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> บันทึก SOP
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
