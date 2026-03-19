"use client";
import React from "react";
import AdminOverview from "../Common/AdminOverview";
import { getUsers, updateRole } from "../../http/apiCalls.js";
import { Button, Input, Table } from "antd"
import ModalInfo from "../Common/ModalInfo";
import { ROLE_TYPES } from "@/utils/constants";
import { notifySuccess } from "@/utils/notify";


const Users = () => {
  const [items, setItems] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pagination, setPagination] = React.useState({ pageNumber: 1, pageSize: 10 });
  const [search, setSearch] = React.useState('');
  const [ editUser, setEditUser ] = React.useState(null);

  const fetchUsers = React.useCallback(async () => {
    try {
      const data = await getUsers({ ...pagination, search });
      setItems(data?.data || []);
      setTotalCount(data?.totalCount || 0);
    } catch (err) {
      console.error(err);
    }
  }, [pagination, search]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    {
      title: 'S.No',
      key: 'serialNo',
      width: 80,
      render: (_, __, index) => (
        <span className="font-medium text-dark">
          {(pagination.pageNumber - 1) * pagination.pageSize + index + 1}
        </span>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <span className="font-medium text-dark">{name}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => {
        return <div>{email}</div>
      },
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
      render: (mobile) => <span className="text-dark-4">{mobile || "-"}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: ((role, record) => {
        return ( 
        <span className="flex gap-3 items-center justify-center">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            role === ROLE_TYPES.ADMIN ? "bg-blue/15 text-blue-dark" : "bg-orange/15 text-orange-dark"
          }`}>{role}</span>
          <Button className="rounded-xl bg-blue px-3 text-white" onClick={() => setEditUser(record)}>Change</Button>
        </span>
        )
      })
    }
  ]

  const getOtherRole = (role) => {
    return (role === ROLE_TYPES.ADMIN) ? ROLE_TYPES.USER : ROLE_TYPES.ADMIN;
  }

  const handleUpdateRole = async () => {
    try {
      const response = await updateRole({userId: editUser.id, role: getOtherRole(editUser.role) });
      if(response?.success){
        notifySuccess("Role updated successfully.");
        setEditUser(null); 
        fetchUsers();
      }
    } catch (error) {
      
    }
  }
  
  return (
    <>
        <section className="page-section bg-gray-2/60">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <AdminOverview
              eyebrow="User Admin"
              title="Manage members and account roles."
              description="Review customer accounts, search members quickly, and control access roles from one screen."
              stats={[{ label: "Users", value: totalCount }]}
            />
            <div className="surface-card p-5 sm:p-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-dark">User List</h2>
                  <p className="text-sm text-dark-4">View members and update account roles.</p>
                </div>
              </div>
              <div className="mb-5 w-full max-w-[320px]">
                <Input placeholder="Search users" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Table className="admin-data-table" dataSource={items} columns={columns} rowKey="id"
                size="middle"
                scroll={{ x: 760 }}
                pagination={{
                  current: pagination.pageNumber,
                  pageSize: pagination.pageSize,
                  total: totalCount,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20'],
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                  onChange(page, pageSize) {
                    setPagination({pageNumber: page, pageSize});
                  },
                }}
                locale={{ emptyText: "No users found." }}
              />
            </div>
          </div>
        </section>
        <ModalInfo content={
          <div>
            <div>
              Are you proceed to Change <span className="font-bold">{editUser?.name}&nbsp;(&nbsp;{editUser?.email}&nbsp;)</span> to <span className="text-green"> {getOtherRole(editUser?.role)} </span>  ?
            </div>
          </div>} isOpen={!!editUser} 
         onClose={()=>{setEditUser(null)}} onOk={handleUpdateRole} />
    </>
  );
};

export default Users;
