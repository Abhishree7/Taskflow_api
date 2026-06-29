interface Props {
  label: string
  value: number
  color: string
  icon: React.ReactNode
}

export function StatCard({ label, value, color, icon }: Props) {
  return (
    <div className="bg-[#16161e] border border-white/7 rounded-xl p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold text-white tabular-nums">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}
