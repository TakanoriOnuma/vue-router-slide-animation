/**
 * pages
 */
// Top page
const Top = {
  template: `
    <div>
      <p>top</p>
      <router-link to="/page1">page1</router-link>
      <router-link to="/page2">page2</router-link>
      <router-link to="/page3">page3</router-link>
    </div>
  `
};

// page1
const Page1 = {
  template: `
    <div>
      <p>page1</p>
      <router-link to="/page2">page2</router-link>
      <router-link to="/page3">page3</router-link>
      <button @click="$router.back()">back</button>
    </div>
  `
};

// page2
const Page2 = {
  template: `
    <div>
      <p>page2</p>
      <router-link to="/page3">page3</router-link>
      <button @click="$router.back()">back</button>
    </div>
  `
};

// page3
const Page3 = {
  template: `
    <div>
      <p>page3</p>
      <button @click="$router.back()">back</button>
    </div>
  `
};

/**
 * router setting
 */
const router = new VueRouter({
  routes: [
    { path: '', component: Top },
    { path: '/page1', component: Page1 },
    { path: '/page2', component: Page2 },
    { path: '/page3', component: Page3 }
  ]
});

/**
 * mount
 */
new Vue({
  el: '#app',
  router,
  template: `
    <div class="page">
      <transition :name="$data.transitionName">
        <router-view class="view" />
      </transition>
    </div>
  `,
  data() {
    const pageNum = window.history.state ? window.history.pageNum || 0 : 0;
    // ページ番号が今のhistoryにない場合は0で初期化する（実際は0でも上書きしているが動作上問題はない）
    if (!pageNum) {
      window.history.replaceState({
        ...window.history.state,
        pageNum
      }, '');
    }
    return {
      pageNum,
      transitionName: 'forward'
    }
  },
  created() {
    // ルーティング前の設定
    this.$router.beforeEach((to, from, next) => {
      // historyにあるページ番号の大小でバックか判定する
      // pushStateの場合はまだ更新されていないので注意
      const { pageNum } = window.history.state;
      this.$data.transitionName = (pageNum < this.$data.pageNum) ? 'backward' : 'forward';
      console.log(`${this.$data.pageNum} -> ${pageNum}:`, this.$data.transitionName);
      next();
    });
    // ルーティング後の設定（pushStateはまだされていない？）
    this.$router.afterEach((to, from) => {
      // ワンクッション挟む（historyの更新が終わっていないため）
      window.setTimeout(() => {
        // 現在のページ番号を取得する
        const { pageNum } = window.history.state;
        // ページ番号がない場合
        if (!pageNum) {
          // $dataのpageNumをインクリメントしてhistoryにセットする
          this.$data.pageNum += 1;
          window.history.replaceState({
            ...window.history.state,
            pageNum: this.$data.pageNum
          }, '');
        } else {
          // ページ番号がある場合は$dataのpageNumの値を更新する
          this.$data.pageNum = pageNum;
        }
      }, 0);
    });
  }
});

