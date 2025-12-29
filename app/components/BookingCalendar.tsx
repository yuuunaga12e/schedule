"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, isWeekend } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, Circle, Triangle, Minus } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 仮の予約可能時間
const AVAILABLE_TIMES = [
    "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
];

export default function BookingCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // 月の表示範囲を計算
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // カレンダー用の全日付配列
    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    // 空き状況判定（モック関数）: 将来的にAPI連携
    const getAvailability = (date: Date) => {
        if (!isSameMonth(date, currentDate)) return "none"; // 月外
        if (isWeekend(date)) return "triangle"; // 土日は△
        return "circle"; // 平日は○
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-border/50">

            {/* 左側：月間カレンダー */}
            <div className="flex-1 min-w-[300px]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground pl-2">{format(currentDate, "yyyy年 M月", { locale: ja })}</h3>
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 曜日ヘッダー */}
                <div className="grid grid-cols-7 text-center border-b border-border">
                    {["日", "月", "火", "水", "木", "金", "土"].map((day, i) => (
                        <div key={day} className={cn("text-xs font-bold py-3 bg-zinc-50/50", i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-muted-foreground")}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* 日付グリッド（隙間なしのボーダーデザイン） */}
                <div className="grid grid-cols-7 border-l border-t border-border">
                    {calendarDays.map((day, dayIdx) => {
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const availability = getAvailability(day);

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => {
                                    setSelectedDate(day);
                                    setSelectedTime(null);
                                }}
                                disabled={!isCurrentMonth}
                                className={cn(
                                    "flex flex-col items-center justify-start py-3 px-1 h-20 md:h-24 border-r border-b border-border transition-all relative outline-none",
                                    !isCurrentMonth ? "bg-zinc-50/30 opacity-30 cursor-default" : "bg-white hover:bg-zinc-50",
                                    isSelected && "bg-accent/30 box-border ring-2 ring-inset ring-primary z-10"
                                )}
                            >
                                {/* 日付数字 */}
                                <span className={cn(
                                    "text-sm font-medium mb-2 w-7 h-7 flex items-center justify-center rounded-full",
                                    isToday(day) ? "bg-primary text-white font-bold" : "text-foreground",
                                    !isCurrentMonth && "text-muted-foreground"
                                )}>
                                    {format(day, "d")}
                                </span>

                                {/* 空き状況マーク */}
                                {isCurrentMonth && (
                                    <span className="mt-1">
                                        {availability === "circle" && <Circle className="w-6 h-6 text-[#c28e8e] stroke-[2.5]" />}
                                        {availability === "triangle" && <Triangle className="w-6 h-6 text-[#d4b36a] fill-[#d4b36a]/20" />}
                                        {availability === "none" && <Minus className="w-6 h-6 text-muted-foreground/30" />}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* 凡例 */}
                <div className="flex justify-end gap-6 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Circle className="w-4 h-4 text-[#c28e8e] stroke-[2.5]" /> 予約可</div>
                    <div className="flex items-center gap-1.5"><Triangle className="w-4 h-4 text-[#d4b36a] fill-[#d4b36a]/20" /> 残りわずか</div>
                    <div className="flex items-center gap-1.5"><Minus className="w-4 h-4 text-muted-foreground/30" /> 予約不可</div>
                </div>
            </div>

            {/* 区切り線 */}
            <div className="hidden lg:block w-px bg-border my-4"></div>

            {/* 右側：タイムスロット選択 */}
            <div className="lg:w-80 flex-shrink-0 flex flex-col">
                <div className="mb-6 pb-4 border-b border-border/50">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                        <Clock className="w-5 h-5 text-primary" />
                        予約時間の選択
                    </h3>
                    <p className="text-sm font-medium text-primary mt-1 ml-7">
                        {format(selectedDate, "M月d日 (E)", { locale: ja })}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 gap-3">
                        {AVAILABLE_TIMES.map((time) => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={cn(
                                    "py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-between group h-14",
                                    selectedTime === time
                                        ? "border-primary bg-primary text-white shadow-md transform scale-[1.02]"
                                        : "border-border bg-white hover:border-primary/50 hover:bg-accent/10 text-foreground"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    {time}
                                    <span className="text-[10px] font-normal opacity-70">〜</span>
                                </span>
                                {selectedTime === time ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <Circle className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/50" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedTime && (
                    <div className="mt-6 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <button className="w-full py-4 bg-secondary text-secondary-foreground rounded-xl font-bold text-lg shadow-lg hover:brightness-110 transition-all active:scale-[0.98]">
                            予約へ進む
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
