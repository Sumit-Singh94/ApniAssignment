import { signOut } from "firebase/auth"
import { auth, db } from "../firebase"
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function Dashboard({ user }) {
  const [issues, setIssues] = useState([])
  const [filter, setFilter] = useState({ status: "", priority: "" })
  const [form, setForm] = useState({ title: "", description: "", priority: "Low", assignedTo: "" })
  const [warning, setWarning] = useState("")

  useEffect(() => {
    const q = query(collection(db, "issues"), orderBy("createdAt", "desc"))
    return onSnapshot(q, snap => {
      setIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [])

  const createIssue = async () => {
    const similar = issues.find(i => i.title.toLowerCase().includes(form.title.toLowerCase()))
    if (similar) {
      setWarning("Similar issue already exists")
      return
    }

    await addDoc(collection(db, "issues"), {
      ...form,
      status: "Open",
      createdBy: user.email,
      createdAt: Date.now()
    })

    setForm({ title: "", description: "", priority: "Low", assignedTo: "" })
    setWarning("")
  }

  const changeStatus = async (issue, next) => {
    if (issue.status === "Open" && next === "Done") {
      alert("Issue must move to In Progress first")
      return
    }
    await updateDoc(doc(db, "issues", issue.id), { status: next })
  }

  const filtered = issues.filter(i =>
    (!filter.status || i.status === filter.status) &&
    (!filter.priority || i.priority === filter.priority)
  )

  const getPriorityColor = (p) => {
    if (p === "High") return "text-rose-500 bg-rose-50 border-rose-100"
    if (p === "Medium") return "text-amber-500 bg-amber-50 border-amber-100"
    return "text-emerald-500 bg-emerald-50 border-emerald-100"
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white hidden md:flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Issue<span className="text-indigo-400">Tracker</span></h1>
              <p className="text-xs text-slate-400">Smart Issue Board</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-8 flex-1">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </p>
            <div className="space-y-3">
              <select 
                className="w-full bg-slate-800/50 text-slate-200 text-sm rounded-xl p-3 border border-slate-700/50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all backdrop-blur-sm"
                onChange={e => setFilter({ ...filter, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <select 
                className="w-full bg-slate-800/50 text-slate-200 text-sm rounded-xl p-3 border border-slate-700/50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all backdrop-blur-sm"
                onChange={e => setFilter({ ...filter, priority: e.target.value })}
              >
                <option value="">All Priorities</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div>
             <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Logged in as</p>
                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => signOut(auth)}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-red-500/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="font-bold">IssueTracker</h1>
            </div>
            <button onClick={() => signOut(auth)} className="text-sm text-slate-300 hover:text-white transition-colors">Logout</button>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
              <p className="text-slate-600">Manage and track your issues efficiently</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Create Issue Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 sticky top-6 backdrop-blur-sm bg-white/90">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  New Issue
                </h2>
                <div className="space-y-4">
                  <div className="group">
                    <input
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all"
                      placeholder="Title"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="group">
                    <textarea
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all min-h-[100px] resize-none"
                      placeholder="Description..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="group">
                       <select 
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                          value={form.priority}
                          onChange={e => setForm({ ...form, priority: e.target.value })}
                        >
                         <option>Low</option>
                         <option>Medium</option>
                         <option>High</option>
                       </select>
                     </div>
                     <div className="group">
                       <input
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                        placeholder="Assignee"
                        value={form.assignedTo}
                        onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                      />
                     </div>
                  </div>
                  
                  {warning && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm animate-pulse">
                      {warning}
                    </div>
                  )}

                  <button 
                    onClick={createIssue}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  >
                    <span className="relative z-10">Submit Issue</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Issue Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-6 bg-white rounded-xl p-4 shadow-sm border border-slate-200/50">
                 <div>
                   <h2 className="text-xl font-bold text-slate-800">Active Issues</h2>
                   <p className="text-sm text-slate-500">Track and manage all issues</p>
                 </div>
                 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                   {filtered.length} {filtered.length === 1 ? 'Issue' : 'Issues'}
                 </div>
              </div>

              {filtered.map(i => (
                <div key={i.id} className="bg-white rounded-2xl border border-slate-200/50 shadow-md hover:shadow-xl transition-all duration-300 group relative overflow-hidden backdrop-blur-sm bg-white/90">
                  {/* Priority Indicator */}
                  <div className={`absolute top-0 left-0 w-2 h-full ${i.priority === 'High' ? 'bg-gradient-to-b from-rose-500 to-rose-600' : i.priority === 'Medium' ? 'bg-gradient-to-b from-amber-500 to-amber-600' : 'bg-gradient-to-b from-emerald-500 to-emerald-600'}`}></div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{i.title}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getPriorityColor(i.priority)}`}>
                        {i.priority}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{i.description}</p>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-medium">Status:</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${i.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                            {i.status}
                          </span>
                        </div>
                        {i.assignedTo && (
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-xs text-slate-500">{i.assignedTo}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1">
                        {["Open", "In Progress", "Done"].map(s => (
                          <button
                            key={s}
                            onClick={() => changeStatus(i, s)}
                            disabled={i.status === s}
                            className={`p-2 rounded-lg transition-all ${i.status === s ? 'opacity-30 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500'}`}
                            title={`Move to ${s}`}
                          >
                             {s === "Open" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                             {s === "In Progress" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                             {s === "Done" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filtered.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">No issues found</p>
                  <p className="text-slate-400 text-sm mt-1">Create your first issue to get started</p>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
