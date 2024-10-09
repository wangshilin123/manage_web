import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker';
import { resultSuccess } from '../_util';
import dayjs from 'dayjs';

// 生成指定数量的模拟表格数据
function generateTableList(count: number): any[] {
  return Array.from({ length: count }, () => ({
    id: faker.number.int(),
    role_id: faker.string.numeric(4),
    role_name: faker.person.firstName(),
    role_email: faker.internet.email({ firstName: 'admin' }),
    role_phone: faker.phone.number(),
    role_status: faker.helpers.arrayElement(['禁用', '启用']),
    role_type: faker.helpers.arrayElement(['运维', '风控', '结算', '运营', '管理员']),
    create_time: dayjs(faker.date.past()).format('YYYY-MM-DD HH:mm'),
    update_time: dayjs(faker.date.recent()).format('YYYY-MM-DD HH:mm'),
  }));
}

export default defineMock({
  // 模拟获取表格数据列表的 API
  '/api/table/list': ({ query }) => {
    // 解构查询参数，设置默认值
    const { page = 1, pageSize = 10, name } = query;
    
    // 转换为数字类型
    const currentPage = Number(page);
    const itemsPerPage = Number(pageSize);

    // 生成模拟数据
    const listField = generateTableList(itemsPerPage);

    // 模拟总数据量，根据是否有搜索条件来变化
    const totalCount = name ? 30 : 60;

    // 计算总页数
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // 返回成功结果，包含分页信息和数据列表
    return resultSuccess({
      pageField: currentPage,
      pageSize: itemsPerPage,
      totalField: totalPages,
      itemCount: totalCount,
      listField,
    });
  },
});