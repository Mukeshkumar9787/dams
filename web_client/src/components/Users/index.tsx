"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { getUsers, updateRole } from "../../http/apiCalls.js";
import { Button, Input, Table } from "antd"
import ModalInfo from "../Common/ModalInfo";
import { ROLE_TYPES } from "@/utils/constants";


const Orders = () => {
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
      title: 'Username',
      dataIndex: 'name',
      key: 'name',
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
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: ((role, record) => {
        return ( 
        <span className="flex gap-3 items-center justify-between">
          <span>{role}</span>
          <Button className="text-white bg-blue p-2" onClick={() => setEditUser(record)}> Change </Button>
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
        window.alert("Role updated successfully");
        setEditUser(null); 
        fetchUsers();
      }
    } catch (error) {
      
    }
  }
  
  return (
    <>
      {/* <!-- ===== Breadcrumb Section Start ===== --> */}
      <section>
        <Breadcrumb title={"Users"} pages={["Users"]} />
      </section>
      {/* <!-- ===== Breadcrumb Section End ===== --> */}
        <section className="overflow-hidden py-10 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <div>
                <Input placeholder="Search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <Table dataSource={items} columns={columns} rowKey="id"
             pagination={{
                current: pagination.pageNumber,
                pageSize: pagination.pageSize,
                total: totalCount,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20'],
                onChange(page, pageSize) {
                  setPagination({pageNumber: page, pageSize});
                },
              }}
            />
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

export default Orders;
