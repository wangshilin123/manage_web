<template>
  <div class="login-container">
    <div class="login-left">
      <div class="login-image"></div>
    </div>
    <div class="login-right">
      <div class="login-form-container">
        <div class="login-logo">
          <img src="@/assets/images/logo.png" alt="logo" />
        </div>
        <h1 class="login-title">{{ websiteConfig.loginDesc }}</h1>
        <a-form
          ref="formRef"
          :model="formState"
          :rules="formRules"
          @submit.prevent="handleSubmit"
          class="login-form"
        >
          <a-form-item name="username">
            <a-input v-model:value="formState.username" size="large" placeholder="用户名">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password v-model:value="formState.password" size="large" placeholder="密码">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          <div class="login-options">
            <a @click="handleForgetPassword" class="forget-password">忘记密码</a>
          </div>
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="loading" block size="large">
              登录
            </a-button>
          </a-form-item>
        </a-form>
        <div class="third-party-login">
          <span>其他登录方式</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { UserOutlined, LockOutlined, GithubOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { websiteConfig } from '@/config/website.config'
import { useUserStore } from '@/store/modules/user'
import { ResultEnum } from '@/enums/httpEnum'
import { PageEnum } from '@/enums/pageEnum'
import { useRouter, useRoute } from 'vue-router'

interface FormState {
  username: string
  password: string
}

const formRef = ref()
const loading = ref(false)
const userStore = useUserStore();
const router = useRouter()
const route = useRoute()
const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME

const formState = reactive<FormState>({
  username: 'admin',
  password: '',
})

const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}


const handleSubmit = async () => {
  try {
    const validationResult = await formRef.value.validate();
      // 表单实际上是有效的，继续登录流程
      const { username, password } = formState;
      console.log('登录信息:', { username, password });
      message.loading('登录中...');
      loading.value = true;
      
      try {
        const { code, message: msg } = await userStore.login(formState);
        message.destroy();
        if (code === ResultEnum.SUCCESS) {
          message.success("登录成功");
        } else {
          message.error("登录失败");
        }
      } finally {
        loading.value = false;
      }
     
  } catch (error) {
    console.error('验证过程中发生错误:', error);
    // 检查是否是预期的验证错误
    if (error && typeof error === 'object' && 'errorFields' in error) {
      const errorFields = (error as any).errorFields;
      if (Array.isArray(errorFields) && errorFields.length === 0) {
        const { code, message: msg } = await userStore.login(formState);
        message.destroy();
        if (code === ResultEnum.SUCCESS) {
          const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
          message.success("登录成功");
          console.log('route.name:', route.name);
          if (route.name === LOGIN_NAME) {
            console.log('登录成功，跳转到首页');
            router.replace('/index');
          } else router.replace(toPath);
          
        } else {
          message.error("登录失败");
        }
      } else {
        // 存在实际的验证错误
        console.error('表单验证失败:', errorFields);
        message.error('请正确填写所有必填字段');
      }
    } else {
      // 未预期的错误
      message.error('表单提交过程中发生错误');
    }
  }
};


const handleForgetPassword = () => {

  message.info('忘记密码功能暂未实现，请联系管理员')
}
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-left {
  flex: 1;
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
}

.login-image {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center;
}

.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.login-form-container {
  width: 100%;
  max-width: 500px;
  padding: 60px;
  background: white;

  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.login-logo {
  text-align: center;
  margin-bottom: 48px;
  img {
    height: 44px;
    margin: 0 auto;
  }
}

.login-title {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
}

.login-form {
  :deep(.ant-form-item) {
    margin-bottom: 24px;
  }

  :deep(.ant-input-affix-wrapper) {
    height: 40px;
  }
}

.login-options {
  text-align: right;
  margin-top: 7%;
  margin-bottom: 7%;
  }


.forget-password {
  color: #1890ff;
  &:hover {
    color: #40a9ff;
  }
}

.third-party-login {
  margin-top: 24px;
  text-align: center;
  span {
    color: rgba(0, 0, 0, 0.45);
    margin-right: 8px;
  }
}
</style>