import React, { useState } from 'react';
import { 
  Clock, 
  Check, 
  Calendar, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Lightbulb,
  Music,
  Wine,
  Utensils
} from 'lucide-react';
import { PartyPlan, TimelinePhase, PrepTask, RunOfShowItem } from '../types/party';

interface TimelineRunOfShowTabProps {
  currentPlan: PartyPlan;
  onToggleTask: (phaseIndex: number, taskId: string) => void;
  onAddTask: (phaseIndex: number, taskName: string, category: string) => void;
}

export const TimelineRunOfShowTab: React.FC<TimelineRunOfShowTabProps> = ({
  currentPlan,
  onToggleTask,
  onAddTask,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'runOfShow'>('timeline');
  const [newTaskInput, setNewTaskInput] = useState<{ [phaseIdx: number]: string }>({});

  const timeline = currentPlan.timeline || [];
  const runOfShow = currentPlan.runOfShow || [];

  const totalTasks = timeline.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const completedTasks = timeline.reduce(
    (acc, p) => acc + (p.tasks?.filter((t) => t.completed).length || 0),
    0
  );
  const percentCompleted = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCreateTask = (phaseIdx: number) => {
    const text = (newTaskInput[phaseIdx] || '').trim();
    if (!text) return;
    onAddTask(phaseIdx, text, 'Shopping');
    setNewTaskInput((prev) => ({ ...prev, [phaseIdx]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Subtab Navigation & Stats Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-slate-900">
            Host Roadmap & Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step prep checklist and hourly party flow so you enjoy your own event.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSubTab('timeline')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeSubTab === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Prep Timeline ({completedTasks}/{totalTasks})
            </button>
            <button
              onClick={() => setActiveSubTab('runOfShow')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeSubTab === 'runOfShow'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Run of Show ({runOfShow.length} Events)
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'timeline' ? (
        <div className="space-y-5">
          {/* Progress Indicator */}
          <div className="bg-linear-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-200/60 rounded-xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800">
                Prep Progress: {completedTasks} of {totalTasks} milestones completed
              </span>
            </div>
            <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {percentCompleted}% Ready
            </span>
          </div>

          {/* Timeline Phases */}
          <div className="space-y-4">
            {timeline.map((phase, pIdx) => {
              const phaseCompleted = phase.tasks.filter((t) => t.completed).length;
              return (
                <div
                  key={phase.phaseName}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
                >
                  {/* Phase Header */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center border border-indigo-100">
                        {pIdx + 1}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-sm text-slate-900">
                          {phase.phaseName}
                        </h3>
                        <span className="text-[11px] text-slate-500">{phase.timeframe}</span>
                      </div>
                    </div>

                    <span className="text-xs text-slate-600">
                      {phaseCompleted}/{phase.tasks.length} done
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="divide-y divide-slate-100 p-2">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onToggleTask(pIdx, task.id)}
                        className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          task.completed ? 'bg-slate-50/70 text-slate-400' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                              task.completed
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-300 bg-white hover:border-indigo-500'
                            }`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <span
                            className={`text-xs font-medium ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {task.task}
                          </span>
                        </div>

                        <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                          {task.category}
                        </span>
                      </div>
                    ))}

                    {/* Add Custom Task Input */}
                    <div className="p-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add another task for this phase..."
                        value={newTaskInput[pIdx] || ''}
                        onChange={(e) =>
                          setNewTaskInput((prev) => ({ ...prev, [pIdx]: e.target.value }))
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateTask(pIdx)}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleCreateTask(pIdx)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* RUN OF SHOW (Party Day Schedule) */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Run of Show: Party Hour-by-Hour
            </h3>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-100 space-y-8">
            {runOfShow.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center text-[10px] font-bold text-indigo-700 shadow-xs">
                  {idx + 1}
                </div>

                <div className="bg-slate-50/70 hover:bg-indigo-50/30 p-4 rounded-xl border border-slate-200/70 transition-colors space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-extrabold text-sm text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                      {item.time}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{item.activity}</h4>
                  </div>

                  <p className="text-xs text-slate-600 flex items-start gap-1.5 pt-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-800">Host Pro Tip:</strong> {item.tip}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
