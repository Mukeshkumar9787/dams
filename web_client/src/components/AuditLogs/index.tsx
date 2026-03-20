"use client";

import React from "react";
import { Button, Input, Table, Tag } from "antd";
import AdminOverview from "@/components/Common/AdminOverview";
import ModalInfo from "@/components/Common/ModalInfo";
import { getAuditLogStats, getAuditLogs } from "@/http/apiCalls";
import { dateFormatter } from "@/utils/helper";

const methodColors = {
  POST: "green",
  PUT: "blue",
  PATCH: "gold",
  DELETE: "red",
};

const toTitleCase = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const AuditActionTags = ({
  action,
  setAction,
}: {
  action: string;
  setAction: (value: string) => void;
}) => {
  const [actionStats, setActionStats] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAuditLogStats();
        if (response?.success) {
          setActionStats(response?.data?.actionStats || {});
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-wrap gap-1 text-xs">
      <div className="flex w-full flex-row items-center gap-2 sm:w-auto">
        <button
          className="rounded-full bg-white p-3"
          onClick={() => setAction("")}
          style={{ border: action === "" ? "1px solid black" : "none" }}
        >
          <div className="min-w-[88px] text-center">
            All ({Object.values(actionStats).reduce((sum, count) => sum + count, 0)})
          </div>
        </button>
      </div>
      {Object.entries(actionStats).map(([itemAction, count]) => (
        <div className="flex w-full flex-row items-center gap-2 sm:w-auto" key={itemAction}>
          <button
            className="rounded-full bg-white p-3"
            style={{ border: itemAction === action ? "1px solid black" : "none" }}
            onClick={() => setAction(itemAction)}
          >
            <div>{toTitleCase(itemAction)} ({Number(count || 0)})</div>
          </button>
        </div>
      ))}
    </div>
  );
};

const AuditLogs = () => {
  const [items, setItems] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pagination, setPagination] = React.useState({ pageNumber: 1, pageSize: 10 });
  const [search, setSearch] = React.useState("");
  const [action, setAction] = React.useState("");
  const [selectedMeta, setSelectedMeta] = React.useState<Record<string, any> | null>(null);

  const fetchAuditLogs = React.useCallback(async () => {
    try {
      const data = await getAuditLogs({ ...pagination, search, action });
      setItems(data?.data || []);
      setTotalCount(data?.totalCount || 0);
    } catch (error) {
      console.error(error);
    }
  }, [pagination, search, action]);

  React.useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const columns = [
    {
      title: "S.No",
      key: "serialNo",
      width: 80,
      render: (_: unknown, __: unknown, index: number) => (
        <span className="font-medium text-dark">
          {(pagination.pageNumber - 1) * pagination.pageSize + index + 1}
        </span>
      ),
    },
    {
      title: "When",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 190,
      render: (value: string) => <span className="text-dark">{dateFormatter(value)}</span>,
    },
    {
      title: "Admin",
      dataIndex: "user",
      key: "user",
      width: 220,
      render: (user: { name?: string; email?: string }) => (
        <div>
          <p className="font-medium text-dark">{user?.name || "-"}</p>
          <p className="text-xs text-dark-4">{user?.email || "-"}</p>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 220,
      render: (value: string) => <span className="font-medium text-dark">{toTitleCase(value)}</span>,
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      width: 120,
      align: "center" as const,
      render: (value: keyof typeof methodColors) => <Tag color={methodColors[value] || "default"}>{value}</Tag>,
    },
    {
      title: "Reference",
      dataIndex: "entityId",
      key: "entityId",
      width: 150,
      render: (value: string | null, record: { entity?: string }) => (
        <div>
          <p className="font-medium text-dark">{value || "-"}</p>
          <p className="text-xs text-dark-4">{toTitleCase(record.entity || "-")}</p>
        </div>
      ),
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
      width: 240,
      render: (value: string) => <span className="text-dark-4">{value}</span>,
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 160,
      render: (value: string | null) => <span className="text-dark-4">{value || "-"}</span>,
    },
    {
      title: "User Agent",
      dataIndex: "userAgent",
      key: "userAgent",
      width: 320,
      render: (value: string | null) => (
        <span className="block max-w-[320px] truncate text-dark-4" title={value || "-"}>
          {value || "-"}
        </span>
      ),
    },
    {
      title: "Details",
      dataIndex: "meta",
      key: "meta",
      render: (value: Record<string, any>) => (
        <Button type="link" className="px-0" onClick={() => setSelectedMeta(value || {})}>
          View details
        </Button>
      ),
    },
  ];

  return (
    <section className="page-section">
      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <AdminOverview
          eyebrow="Admin Audit"
          title="Review admin activity in one dedicated log."
          description="Track successful admin-side changes across products, orders, users, config, and other protected modules."
          stats={[{ label: "Entries", value: totalCount }]}
        />

        <div className="admin-page-card">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-dark">Audit Log</h2>
              <p className="text-sm text-dark-4">Search by admin name, email, entity, or route.</p>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="w-full max-w-[360px]">
              <Input
                placeholder="Search audit logs"
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((prev) => ({ ...prev, pageNumber: 1 }));
                }}
              />
            </div>
            <AuditActionTags
              action={action}
              setAction={(value) => {
                setAction(value);
                setPagination((prev) => ({ ...prev, pageNumber: 1 }));
              }}
            />
          </div>

          <Table
            className="admin-data-table"
            dataSource={items}
            columns={columns}
            rowKey="id"
            size="middle"
            scroll={{ x: 1760 }}
            pagination={{
              current: pagination.pageNumber,
              pageSize: pagination.pageSize,
              total: totalCount,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
              onChange(page, pageSize) {
                setPagination({ pageNumber: page, pageSize });
              },
            }}
            locale={{ emptyText: "No audit log entries found." }}
          />
        </div>
      </div>
      <ModalInfo
        isOpen={!!selectedMeta}
        onClose={() => setSelectedMeta(null)}
        closable
        onOk={() => setSelectedMeta(null)}
        content={
          <div>
            <h3 className="mb-3 text-lg font-semibold text-dark">Audit Meta</h3>
            <pre className="max-h-[60vh] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              {JSON.stringify(selectedMeta, null, 2)}
            </pre>
          </div>
        }
      />
    </section>
  );
};

export default AuditLogs;
