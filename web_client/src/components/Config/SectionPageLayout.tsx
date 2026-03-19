"use client";

import React from "react";
import AdminOverview from "@/components/Common/AdminOverview";

const SectionPageLayout = ({
  eyebrow = "Admin Settings",
  title,
  description,
  stats = [],
  children,
  onSubmit,
  isSaving = false,
  saveLabel = "Save Changes",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  stats?: Array<{ label: string; value: string | number }>;
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving?: boolean;
  saveLabel?: string;
}) => {
  return (
    <section className="page-section bg-gray-2/60">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <AdminOverview
          eyebrow={eyebrow}
          title={title}
          description={description}
          stats={stats}
        />
        <div className="surface-card max-w-[1040px] w-full overflow-hidden p-0 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
          <form onSubmit={onSubmit} className="p-5 sm:p-7">
            {children}
            <div className="mt-8 flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-blue px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "Saving..." : saveLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SectionPageLayout;
