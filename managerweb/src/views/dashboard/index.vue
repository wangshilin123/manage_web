<template>
    <div class="dashboard">
      <div class="stats-cards">
        <div class="stat-card" v-for="(stat, index) in stats" :key="index">
          <h3>{{ stat.title }}</h3>
          <p class="stat-value">{{ stat.value }}</p>
          <p class="stat-change" :class="stat.changeType">
            {{ stat.change }}
          </p>
        </div>
      </div>
      
      <!-- 占位符，用于后续添加其他内容 -->
      <div class="placeholder-content">
        <h2>工作区内容将在这里展示</h2>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Dashboard',
    data() {
      return {
        stats: [
          { title: '本月注册人数', value: '1689', change: '51% 已超过上周', changeType: 'increase' },
          { title: '本月订单数', value: '2580', change: '12% 少于上周', changeType: 'decrease' },
          { title: '本周支付金额', value: '¥3,980', change: '8% 少于上周', changeType: 'decrease' },
          { title: '本月销售总额', value: '¥16,895', change: '61% 已超过上周', changeType: 'increase' },
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard {
    padding: 20px;
  }
  
  .stats-cards {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .stat-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    width: 23%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0;
  }
  
  .stat-change {
    font-size: 14px;
  }
  
  .increase {
    color: #4caf50;
  }
  
  .decrease {
    color: #f44336;
  }
  
  .placeholder-content {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    color: #666;
  }
  </style>