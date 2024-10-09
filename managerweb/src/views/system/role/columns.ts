import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface ListData {
  id: number;
  role_id: string;
  role_name: string;
  role_type: string;
  role_phone: string;
  role_email: string;
  role_status: string;
  create_time: string;
  update_time: string;
  role_desc: string;
  
}

export const columns: BasicColumn[] = [
  {
    title: 'id',
    key: 'id',
  },
  {
    title: '角色ID',
    key: 'role_id',
  },
  {
    title: '角色名称',
    key: 'role_name',
    edit: true,
  },
  {
    title: '角色类型',
    key: 'role_type',
  },
  {
    title: '角色电话',
    key: 'role_phone',
    edit: true,
  },
  {
    title: '角色邮箱',
    key: 'role_email',
    edit: true,
  },
  {
    title: '角色状态',
    key: 'role_status',
    edit: true,
  },
  {
    title: '创建时间',
    key: 'create_time',
  },
  {
    title: '更新时间',
    key: 'update_time',
  },
  {
    title: '角色描述',
    key: 'role_desc',
    edit: true,
  },
];
