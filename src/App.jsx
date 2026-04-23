import React, { useState, useEffect, useMemo } from 'react';

const TaskApp = () => {
  // 로컬 스토리지 데이터 불러오기
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [bulkInput, setBulkInput] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  // 데이터 변경 시 자동 저장
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // D-Day 계산 로직 
  const getDDayInfo = (targetDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { label: "D-Day", color: "text-red-600 font-bold" };
    if (diffDays < 0) return { label: `지연 (${Math.abs(diffDays)}일)`, color: "text-gray-500" };
    if (diffDays <= 3) return { label: `D-${diffDays}`, color: "text-orange-500 font-semibold" };
    return { label: `D-${diffDays}`, color: "text-blue-500" };
  };

  // 할 일 추가 (단일) [cite: 20]
  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input,
      date: date || new Date().toISOString().slice(0, 10),
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setInput("");
  };

  // 벌크 입력 처리 
  const handleBulkAdd = () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput.split('\n').filter(line => line.trim());
    const newTasks = lines.map((line, index) => ({
      id: Date.now() + index,
      text: line,
      date: new Date().toISOString().slice(0, 10),
      completed: false,
    }));
    setTasks([...newTasks, ...tasks]);
    setBulkInput("");
    setShowBulk(false);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // 통계 계산 (Progress Bar) 
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percent };
  }, [tasks]);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-black mb-6 text-center">📋 MY WORKFLOW</h1>

      {/* 통계 대시보드 [cite: 19, 32] */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-gray-100">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-3xl font-bold text-black">{stats.percent}%</span>
            <span className="text-gray-500 text-sm ml-2">완료됨</span>
          </div>
          <span className="text-sm text-gray-400">{stats.done} / {stats.total} Tasks</span>
        </div>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-black h-full transition-all duration-500 ease-out" 
            style={{ width: `${stats.percent}%` }}
          />
        </div>
      </div>

      {/* 입력 섹션 (모바일 최적화)  */}
      <div className="space-y-3 mb-8">
        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
            placeholder="할 일을 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <input 
            type="date" 
            className="p-3 border rounded-xl sm:w-40" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={addTask} className="bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800 transition">추가</button>
        </div>
        
        <button 
          onClick={() => setShowBulk(!showBulk)}
          className="text-sm text-gray-500 underline decoration-dotted"
        >
          {showBulk ? "입력창 닫기" : "여러 줄 한꺼번에 입력하기"}
        </button>

        {showBulk && (
          <div className="flex flex-col gap-2 mt-2 animate-fadeIn">
            <textarea 
              className="w-full p-3 border rounded-xl h-32 focus:ring-2 focus:ring-black outline-none"
              placeholder="한 줄에 하나씩 업무를 적어주세요."
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
            />
            <button onClick={handleBulkAdd} className="bg-gray-200 text-black p-2 rounded-xl font-semibold hover:bg-gray-300">일괄 추가 실행</button>
          </div>
        )}
      </div>

      {/* 리스트 섹션 [cite: 3, 22] */}
      <ul className="space-y-3">
        {tasks.map(task => {
          const dday = getDDayInfo(task.date);
          return (
            <li key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex items-center justify-between group">
              <div className="flex items-center gap-3 flex-1">
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 accent-black cursor-pointer"
                />
                <span className={`text-lg transition-all ${task.completed ? "line-through text-gray-300" : "text-gray-800"}`}>
                  {task.text}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`block text-xs font-bold ${dday.color}`}>{dday.label}</span>
                  <span className="text-[10px] text-gray-400">{task.date}</span>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 rounded-lg"
                >
                  삭제
                </button>
              </div>
            </li>
          );
        })}
        {tasks.length === 0 && (
          <div className="text-center py-20 text-gray-300 italic">할 일이 없습니다. 새로운 작업을 추가해보세요!</div>
        )}
      </ul>
    </div>
  );
};

export default TaskApp;
