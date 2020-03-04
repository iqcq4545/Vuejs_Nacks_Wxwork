<template>
  <div class="page">
    <!-- agoDayHide='getTime()/1000' -->
    <!-- futureDayHide="getTime()/1000" -->
    <Calendar ref="Calendar" :markDate="rest" :markDateMore="arr" @isToday="clickToday" @choseDay="clickDay"
      @changeMonth="clickMonth"></Calendar>

    <div class="taskList">
      <div class="tab">
        <b>{{this.date.click||this.date.today}}</b>
        <ul>
          <li :class="taskType===0&&'on'" @click="changeTask(0)">待办任务</li>
          <!-- <li :class="taskType===1&&'on'" @click="changeTask(1)">完成任务</li> -->
        </ul>
      </div>
      <div v-if="jobList.length>0&&taskType===0&&'on'" class="item todo">
        <dl :class="item.Status.Id==='8e4ccfef-ccf4-40f3-88d4-42b98e2fb9b0'&&'cancel'" v-for="(item,i) in jobList"
          :key="i" @click="shwoDetail(i)">
          <b>{{item.Status.Name}}</b>
          <dt>{{item.Name}}</dt>
          <dd>
            <h3>发送人 :</h3>
            <p>{{item.Creater.UserName}}</p>
          </dd>
          <dd>
            <h3>发送时间 :</h3>
            <p>{{item.CreateTime}}</p>
          </dd>
        </dl>
      </div>
      <!-- <div v-if="taskType===1&&'on'" class="item complete">
        <dl v-for="(item,i) in jobList" :key="i">
          <b>{{item.Status.Name}}</b>
          <dt>{{item.Name}}</dt>
          <dd>
            <h3>发送人 :</h3>
            <p>{{item.Creater.UserName}}</p>
          </dd>
          <dd>
            <h3>发送时间 :</h3>
            <p>{{item.CreateTime}}</p>
          </dd>
        </dl>
      </div> -->
    </div>

    <div v-if="!jobList.length" class="NoData">
      <p>没有任务</p>
    </div>

    <Detail v-if="DetailOption.isShow" :DetailOption="DetailOption"></Detail>

  </div>

</template>

<script>
  import { cookiesValue } from "../../../utils/cookies";

  import Calendar from "@/components/Calendar";
  import Detail from '@/components/Detail';

  export default {
    inject: [/*"reload",*/ "Toast", "Confirm"],
    data() {
      return {
        taskType: 0,
        rest: [],
        arr: [],
        newDate: new Date(),
        jobList: [],
        lastDate: [],
        DetailOption: {
          isShow: false,
          image: false,
          type: "form",
          title: undefined,
          desc: undefined,
          data: undefined,
          field: undefined,
          value: undefined,
          maskImg: undefined,
          editable: true
        },
        date: { today: undefined, click: undefined },
        isClick: false
      };
    },
    components: {
      Calendar: Calendar,
      Detail: Detail
    },
    created() {

    },
    mounted() {
      function format(date, i = 0) {
        date = new Date(date);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${i}`;
      }

      this.getCalendar();

      /*this.arr = [
        {
          date: format(new Date(), 3),
          className: "mark1"
        },
        {
          date: format(new Date(), 12),
          className: "mark1"
        }
      ];
      this.arr.push({
        date: format(new Date(), 15),
        className: "mark1"
      });*/
    },
    methods: {
      clickDay(data) {
        //this.Toast({ text: "选中了" + data });
        this.date.click = data;
        this.getCalendar(data);
        this.isClick = true;
        this.getJobList(data);
      },
      clickToday(data) {
        this.date.today = data;
        if (!this.isClick) {
          this.getJobList(data);
        }

      },
      clickMonth(data) {
        //this.Toast({ text: "切换到的月份为" + data });
        this.getCalendar(data);
      },
      demo() {
        this.$refs.Calendar.ChoseMonth("2018-12-12"); //跳到12月12日选中12月12日
      },
      getCalendar(data = undefined) {
        var ymd = [];
        if (data) {
          ymd = data.split("/");
        }
        else {
          ymd = [this.newDate.getFullYear(), this.newDate.getMonth() + 1];
        }
        if (ymd[0] == this.lastDate[0] && ymd[1] == this.lastDate[1]) {
          return false;
        }
        this.lastDate = ymd;
        this.rest = [];
        this.$ReqTools.getCalendar({ year: ymd[0], month: ymd[1] }).then((res) => {
          if (res.data.result === "success") {
            var ym = ymd[0] + "/" + ymd[1] + "/";
            for (var i = 0; i < res.data.list.length; i++) {
              var item = res.data.list[i];
              if (item.IsFree) {
                this.rest.push(ym + (i + 1));
              }
            }
          }
        });
      },
      getJobList(data) {
        this.$ReqTools.getJobList({ receiverId: cookiesValue("ZT_DevicePlatForm_UserId"), date: data.replace(/\//g, "-") }).then((res) => {
          this.jobList = res.data.list;
        });
      },

      changeTask(type) {
        this.taskType = type;
      },

      shwoDetail(i) {
        var item = this.jobList[i];
        this.DetailOption.title = item.Name;
        this.DetailOption.desc = this.date.click || this.date.today;
        this.DetailOption.field = [];

        this.DetailOption.field.push([
          { name: "开始日期", value: item.BeginDate, class: "input" },
          { name: "结束日期", value: item.EndDate, class: "input" }]);

        for (var j = 0; j < item.WorkJobItemList.length; j++) {
          var tmp = item.WorkJobItemList[j],
            ary = [
              { name: "内容", value: tmp.Name, class: "input" },
              { name: "备注", value: tmp.Remark, class: "input" }];
          this.DetailOption.field.push(ary);
        }

        this.DetailOption.field.push([
          { name: "发送人", value: item.Creater.UserName, class: "input" },
          { name: "发送时间", value: item.CreateTime, class: "input" },
          { name: "状态", value: item.Status.Name, class: "input" }
        ]);
        this.DetailOption.value = "string";
        this.DetailOption.isShow = true;
      },

    }
  };
</script>

<!-- Add "scoped " attribute to limit CSS to this component only -->
<style>
  .Calendar {
    background: #fff;

  }

  ul.dateItem .mark1 p {
    background: #0abf5b;
    color: #fff
  }

  ul.dateItem .mark2 p {
    background-color: #ff9d00;
    color: #fff
  }

  .taskList {
    width: 6.9rem;
    background: #fff;
    padding: 0 .3rem;
    margin: .25rem 0 0 0;
  }

  .taskList .tab {
    width: 6.9rem;
  }

  .taskList .tab b {
    top: .075rem;
    left: .05rem;
    position: absolute;
    line-height: .75rem;
    color: #999;
    font-weight: normal;
  }

  .taskList ul {
    margin: .075rem 0 0 0;
    z-index: 2;
    width: 3.75rem;
    padding: 0 .25rem;
    display: flex;
    justify-content: space-between;
    float: right;
  }

  .taskList ul li {
    font-size: .28rem;
    color: #9ca0b8;
    line-height: .3rem;
    padding: .2rem 0;
    border-bottom: .05rem solid transparent;
  }

  .taskList ul li.on {
    border-bottom-color: #3f51b5;
    color: #3f51b5;
  }

  .taskList dl {
    width: 5.7rem;
    padding: .15rem 0 .15rem 1.2rem;
  }

  .taskList dl dt {
    font-size: .28rem;
    width: 100%;
    line-height: .5rem;
    font-weight: bold;
  }

  .taskList dl b {
    position: absolute;
    left: 0;
    font-size: .24rem;
    line-height: .26rem;
    padding: .05rem .10rem;
    background: #f4f5f5;
    border-radius: .05rem;
    margin: .07rem .10rem .07rem 0;

  }

  .taskList .item {
    z-index: 1;
    margin-top: -.0225rem;
    border-top: 1px #eee solid;
    padding: .15rem 0;
  }

  .taskList .todo dl b {
    background: #fff9f0;
    color: #ff9d00;
  }

  .taskList .complete dl b {
    background: #f0fff5;
    color: #0abf5b;
  }

  .taskList dl dd {
    width: 100%;
    color: #333;
  }

  .taskList dl dd h3 {
    line-height: .4rem;
    font-size: .24rem;
  }

  .taskList dl dd p {
    line-height: .4rem;
    font-size: .24rem;
    margin: 0 .1rem;
  }

  .taskList dl.cancel b {
    background: #f9f9f9;
    color: #bbb;
  }

  .taskList dl.cancel dt {
    color: #bbb;
  }

  .taskList dl.cancel dd {
    color: #bbb;
  }

  .NoData {
    top: 8rem;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
  }

  .NoData p {
    width: 7.5rem;
    color: #aaa;
    text-align: center;
    text-shadow: 1px 1px 1px rgb(0, 0, 0, .15);
    font-size: .3rem;
    line-height: .4rem;
    top: 50%;
    position: absolute;
    margin-top: -.2rem;
  }
</style>