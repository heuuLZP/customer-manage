<template>
  <div class="layout">
        <Layout>
            <Header :style="{position: 'fixed', width: '100%'}">
                <Menu mode="horizontal" theme="dark" active-name="1" @on-select="activeNameFun" >
                    <div class="layout-logo">
                      佳友站
                    </div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                            客户列表
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="ios-navigate"></Icon>
                            添加客户
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Content :style="{margin: '88px 20px 0', background: '#fff', minHeight: '500px',paddingBottom: '60px',}">
                <div class='table-wrapper'  v-if="activeName === '1'">
                    <div class="search-wrapper">
                        <Input ref="searchInput"
                        class="search-box"
                        icon="ios-search-strong"
                        placeholder="请输入手机号查询"
                        @on-click="searchChange"
                        @on-enter="searchChange"
                        ></Input>
                    </div>
                  <Table height='520' :columns="columns" :data="customerData"></Table>
                  <div class="page-wrapper">
                    <Page @on-change="pageChange" :total="pageObj.dataCount" :page-size="pageObj.pageSize"></Page>
                  </div>
                </div>
                <div v-else style="padding-top:20px;">
                  <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
                    <FormItem label="姓名" prop="name">
                      <Row>
                          <Col :xs="12" :sm="8" :md="6" :lg="6">
                            <Input v-model="formItem.name" placeholder="请输入姓名"></Input>
                          </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="电话"  prop="tel">
                      <Row>
                          <Col :xs="12" :sm="8" :md="6" :lg="6">
                            <Input v-model="formItem.tel" placeholder="请输入电话"></Input>
                          </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="车牌">
                      <Row>
                          <Col  :xs="12" :sm="8" :md="6" :lg="6">
                            <Input v-model="formItem.carNumber" placeholder="请输入车牌"></Input>
                          </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="车型">
                      <Row>
                          <Col  :xs="12" :sm="8" :md="6" :lg="6">
                            <Input v-model="formItem.carStyle" placeholder="请输入车型"></Input>
                          </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="日期"  prop="date">
                        <Row>
                            <Col  :xs="12" :sm="8" :md="6" :lg="6">
                                <DatePicker type="date" placeholder="请选择日期"   v-model="formItem.date" format="yyyy-MM-dd" @on-change="dateChange"></DatePicker>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="服务类型">
                        <Col  :xs="12" :sm="8" :md="6" :lg="6">
                          <Select v-model="formItem.type">
                              <Option value="维修">维修</Option>
                              <Option value="保养">保养</Option>
                              <Option value="洗车">洗车</Option>
                          </Select>
                        </Col>
                    </FormItem>
                    <FormItem label="服务记录">
                        <Row>
                            <Col  :xs="12" :sm="8" :md="6" :lg="6">
                              <Input v-model="formItem.detail" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入服务记录"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Button v-if="addActive" type="primary" @click="submit('formValidate')">提交</Button>
                        <Button v-else type="primary" disabled>提交</Button>
                        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                    </FormItem>
                  </Form>
                </div>
            </Content>
        </Layout>
        <Footer class="layout-footer-center">2016 &copy; 佳友站</Footer>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'customer',
  data(){
    return {
      activeName: '1', // 活动tab的名称
      addActive: true, // 添加按钮活动状态
      searchValue: '', // 搜索栏的值
      pageObj: {
        dataCount: 1,
        pageSize: 10
      },
      columns: [
          {
              title: '姓名',
              key: 'name'
          },
          {
            title: '电话',
            key: 'tel'
          },
          {
              title: '车牌',
              key: 'carNumber',
              sortable: false
          },
          {
              title: '车型',
              key: 'carStyle'
          },
          {
              title: '日期',
              key: 'date',
              sortable: true
          },
          {
              title: '服务类型',
              key: 'type'
          },
          {
              title: '服务记录',
              key: 'detail'
          }
      ],
      customerData: [
          {
              name: '涛涛',
              tel: 18633417896,
              carNumber: '冀ELV543',
              carStyle: 'k2 1.4排量',
              date: '2016-10-03',
              type: '保养',
              detail: '机油',
          }
      ],
      formItem: {
            name : '',
            tel : '',
            carNumber : '',
            carStyle : '',
            date : '',
            type : '',
            detail :  ''
      },
      ruleValidate: {
            name: [
                { required: true, message: 'The name cannot be empty', trigger: 'blur' }
            ],
            tel: [
                { required: true, message: 'The tel cannot be empty', trigger: 'blur' }
            ],
            date: [
                { required: true, type: 'date', message: 'Please select the date', trigger: 'change' }
            ],
        }
    }
  },
  props: {
  },
  mounted(){
    this.fetch(1)
  },
  methods: {
    fetch(page){
        let params = {
            page: page,
            keyword: this.searchValue
        }
        axios.post('/api/customer/list', params)
            .then((res) => {
                if(res.data.code === 200){
                    this.customerData = res.data.list
                    this.pageObj =  res.data.page
                } else {
                    this.$Notice.error({
                        title:  res.data.msg,
                    });
                }
            })
            .catch((error) => {
                this.addActive = true;
                console.log(error);
            });
    },
    activeNameFun(value){
      this.activeName = value
      if(value === '1'){
          this.searchValue = ''
          this.fetch(1)
      }
    },
    submit(name){
        const submitFun = () => {
            // 禁止重复提交
            this.addActive = false;
            this.formItem.date = this.date
            // 执行add接口
            axios.post('/api/customer/add', this.formItem)
            .then((res) => {
                this.addActive = true;
                if(res.data.code === 200){
                    this.$Notice.success({
                        title: res.data.msg
                    });
                    // 清空表单
                    this.$refs[name].resetFields();
                } else {
                    this.$Notice.error({
                        title:  res.data.msg,
                    });
                }
            })
            .catch((error) => {
                this.addActive = true;
                console.log(error);
            });
        }
        // 校验
        this.$refs[name].validate((valid) => {
            if(valid){
                submitFun()
            }
        })
    },
    handleReset (name) {
        this.$refs[name].resetFields();
    },
    /**
     * 修改筛选字符串
     */
    searchChange() {
        this.searchValue = this.$refs.searchInput.currentValue
        this.fetch(1)
    },
    // 点击分页组件
    pageChange(value){
        this.page = value
        this.fetch(this.page)
    },
    dateChange(value){
        this.date = value
    }
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ivu-layout {
  min-height: 100%;
  padding-bottom: 70px;
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    min-height: 100%;
}
.ivu-layout-header {
  z-index: 1024;
}
.layout-logo{
    width: 100px;
    height: 30px;
    line-height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
    text-align: center;
    color: #fff;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
.ivu-layout-footer {
  position: absolute;
  bottom:0;
  width: 100%;
}
.layout-footer-center{
    text-align: center;
}

/* 自定义样式  */
.table-wrapper {
    min-height: 520px;
    position: relative;
}
.page-wrapper {
    position: absolute;
    left: 0;
    bottom:-45px;
    width:100%;
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
}
.search-wrapper {
  padding: 20px;
}
.search-box {
  width: 300px;
}
</style>
