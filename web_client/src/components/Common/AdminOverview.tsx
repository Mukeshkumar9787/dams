import React from "react";

type AdminOverviewStat = {
  label: string;
  value: string | number;
};

const AdminOverview = ({
  eyebrow = "Admin Panel",
  title,
  description,
  stats = [],
}: {
  eyebrow?: string;
  title: string;
  description: string;
  stats?: AdminOverviewStat[];
}) => {
  return (
    <div className="mb-6 overflow-hidden rounded-[30px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),linear-gradient(135deg,#fff7ed_0%,#ffffff_42%,#eff6ff_100%)] p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[620px]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            {description}
          </p>
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white bg-white px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
