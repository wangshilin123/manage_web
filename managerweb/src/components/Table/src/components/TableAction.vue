<template>
    <div class="tableAction">
      <div class="flex items-center justify-center">
        <!-- 遍历并渲染主要操作按钮 -->
        <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
          <a-popconfirm
          v-if="action.popConfirm"
          :title="action.popConfirm.title"
          :ok-text="action.popConfirm.okText"
          :cancel-text="action.popConfirm.cancelText"
          @confirm="confirm"
          >
          <n-button v-bind="action" class="mx-1">
            {{ action.label }}
            <!-- 如果有图标，则渲染图标 -->
            <template #icon v-if="action.hasOwnProperty('icon')">
              <n-icon :component="action.icon" />
            </template>
          </n-button>
        </a-popconfirm>
        <n-button v-else v-bind="action" class="mx-1">
        {{ action.label }}
            <!-- 如果有图标，则渲染图标 -->
            <template #icon v-if="action.hasOwnProperty('icon')">
              <n-icon :component="action.icon" />
            </template>
          </n-button>
        </template>
        <!-- 如果有下拉操作且列表不为空，则渲染下拉菜单 -->
        <n-dropdown
          v-if="dropDownActions && getDropdownList.length"
          trigger="hover"
          :options="getDropdownList"
          @select="select"
        >
          <slot name="more"></slot>
          <!-- 如果没有自定义 more 插槽，则渲染默认的"更多"按钮 -->
          <n-button  v-bind="getMoreProps" class="mx-1" v-if="!$slots.more" icon-placement="right">
            <template #icon>
              <n-icon size="15">
                <DownOutlined />
              </n-icon>
            </template>
              状态
          </n-button>
        </n-dropdown>
      </div>
    </div>
  </template>
  
  <script lang="ts">
    import { defineComponent, PropType, computed, toRaw } from 'vue';
    import { ActionItem } from '@/components/Table';
    import { usePermission } from '@/hooks/web/usePermission';
    import { isBoolean, isFunction } from '@/utils/is';
    import { DownOutlined } from '@vicons/antd';
    import { h } from 'vue';
    import { Popconfirm } from 'ant-design-vue';
    import { message } from 'ant-design-vue';
  
    export default defineComponent({
      name: 'TableAction',
      components: { DownOutlined },
      props: {
        // 主要操作按钮列表
        actions: {
          type: Array as PropType<ActionItem[]>,
          default: null,
          required: true,
        },
        // 下拉菜单操作列表
        dropDownActions: {
          type: Array as PropType<ActionItem[]>,
          default: null,
        },
        // 按钮样式：'button' | 'text' | 'link'
        style: {
          type: String as PropType<String>,
          default: 'button',
        },
        // 下拉菜单选择回调
        select: {
          type: Function as PropType<Function>,
          default: () => {},
        },
      },
      setup(props) {
        const { hasPermission } = usePermission();
  
        // 根据 style 属性确定按钮类型和是否为文本按钮
        const actionType =
          props.style === 'button' ? 'default' : props.style === 'text' ? 'primary' : 'default';
        const actionText =
          props.style === 'button' ? undefined : props.style === 'text' ? true : undefined;
        const confirm = (e: MouseEvent) => {
          console.log(e);
          message.success('操作成功');
        }
        const getMoreProps = computed(() => {
          return {
            text: actionText,
            type: actionType,
            color: 'green',
            size: 'medium',
            style: 'width: 80px;',
          };
        });
        const getDropdownList = computed(() => {
          return (toRaw(props.dropDownActions) || [])
            .filter((action) => {
              return hasPermission(action.auth as string[]) && isIfShow(action);
            })
            .map((action) => {
              const { popConfirm } = action;
              return {
                size: 'medium',
                text: actionText,
                type: actionType,
                ...action,
                ...popConfirm,
                onConfirm: popConfirm?.confirm,
                onCancel: popConfirm?.cancel,
              };
            });
        });
  
        function isIfShow(action: ActionItem): boolean {
          const ifShow = action.ifShow;
  
          let isIfShow = true;
  
          if (isBoolean(ifShow)) {
            isIfShow = ifShow;
          }
          if (isFunction(ifShow)) {
            isIfShow = ifShow(action);
          }
          return isIfShow;
        }
        
  
        const getActions = computed(() => {
          return (toRaw(props.actions) || [])
            .filter((action) => {
              return hasPermission(action.auth as string[]) && isIfShow(action);
            })
            .map((action) => {
              const { popConfirm } = action;
              //需要展示什么风格，自己修改一下参数
              return {
                size: 'large',
                text: actionText,
                type: actionType,
                ...action,
                ...(popConfirm || {}),
                enable: !!popConfirm,
              };
            });
          });
        return {
          getActions,
          getDropdownList,
          getMoreProps,
          confirm
        };
      },
    });
  </script>
