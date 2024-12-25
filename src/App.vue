<template>
  <div style="padding: 16px; font-family: Arial, sans-serif;">
    <!-- 操作按钮部分 -->
    <div style="margin-bottom: 16px; display: flex; gap: 8px;">
      <button @click="selectFolder">选择文件夹</button>
      <button @click="addPost">添加后缀名</button>
      <button @click="generate" :disabled="isGenerating">
        {{ isGenerating ? "生成中..." : "生成" }}
      </button>
    </div>

    <!-- 后缀名列表 -->
    <div style="margin-bottom: 16px;">
      <ul>
        <li v-for="(item, index) in posts" :key="index" style="display: flex; align-items: center; gap: 8px;">
          {{ item }}
          <button @click="removeItem(index)" style="color: red;">删除</button>
        </li>
      </ul>
    </div>

    <!-- 输入框部分 -->
    <div style="margin-bottom: 16px;">
      <input type="text" v-model="post" placeholder="请输入后缀名,如后缀为py的文件请输入py"
        style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
    </div>

    <!-- 文件展示部分 -->
    <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 16px;">
      <div v-for="(item, index) in names" :key="index" style="text-align: center; width: 150px;">
        <img :src="item.post" :alt="item.name" style="height: 100px; width: 100px; object-fit: contain;" />
        <div style="margin-top: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          {{ item.name }}
        </div>
      </div>
    </div>


    <!-- 消息提示 -->
    <div v-if="message" style="margin-top: 16px; text-align: center; color: green;">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, reactive } from 'vue';
import { ElNotification } from 'element-plus'

const post = ref('');
const posts = reactive([]);
const files = reactive([]);
const names = reactive([]);
const isGenerating = ref(false);
const message = ref('');
const file_post = reactive(['c', 'cpp', 'cs', 'css', 'html', 'java', 'js', 'pdf', 'py'])
document.title = '源代码生成器'

async function selectFolder() {
  files.length = 0;
  names.length = 0;
  message.value='';
  try {
    const res = await window.electronAPI.selectFolder();

    if (res) {
      ElNotification.success({
        title: 'Success',
        message: '正在打开文件中，请稍等',
        offset: 10,
      })
      res.forEach(element => {
        files.push(element);
        let file_name = element.split('/').pop()
        let post = file_name.split('.').pop()
        let post_img = file_post.includes(post) ? post : 'file'
        if (posts.length === 0 || posts.includes(post))
          names.push(
            {
              'name': file_name,
              'post': 'image/' + post_img + '.png'
            }
          );
      });
    } else {
      console.log('文件夹选择已取消');
    }
  } catch (error) {
    console.error('选择文件夹时出错:', error);
  }
}

function addPost() {
  if (post.value.trim()) {
    posts.push(post.value.trim());
    updateNames();
    post.value = '';
  }
}

function removeItem(index) {
  posts.splice(index, 1);
  updateNames();
}

function updateNames() {
  names.length = 0;
  files.forEach(element => {
    if (posts.length === 0 || posts.includes(element.split('.').pop())) {
      let file_name = element.split('/').pop()
      let post = file_name.split('.').pop()
      post = file_post.includes(post) ? post : 'file'
      names.push(
        {
          'name': file_name,
          'post': 'image/' + post + '.png'
        }
      );
    }
  });
}

async function generate() {
  const data = files.filter(element => posts.length === 0 || posts.includes(element.split('.').pop()));
  isGenerating.value = true;
  message.value = '';

  try {
    const res = await window.electronAPI.generate(JSON.stringify(data));
    files.length = 0;
    message.value = '生成成功,文件已生成在桌面上';
    ElNotification.success({
      title: 'Success',
      message: '生成成功,文件已生成在桌面上',
      offset: 10,
    })
    names.length = 0;
    files.length = 0;
  } catch (error) {
    // console.error('生成时出错:', error);
    message.value = '生成失败，请重试。';
  } finally {
    isGenerating.value = false;
  }
}
</script>

<style>
button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #003f7f;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
