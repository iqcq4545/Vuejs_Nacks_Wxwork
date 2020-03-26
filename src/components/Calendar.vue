<template>
  <div class="Calendar">
    <div class="container">
      <div class="cbody">
        <dl class="monthPicker">
          <dt class="YearMonth">
            <select v-model="dateTop[0]" @change="changeYM()">
              <option v-for="(item,i) in YM.year" :value="item">{{item}}</option>
            </select>
            年
            <select v-model="dateTop[1]" @change="changeYM()">
              <option v-for="(item,i) in YM.month" :value="item">{{item+1}}</option>
            </select>
            月</dt>
          <dd class="arrowLeft" @click="PreMonth(myDate,false)">＜</dd>
          <dd class="arrowRight" @click="NextMonth(myDate,false)">＞</dd>
        </dl>
        <ul class="dayTag">
          <li class="tag" v-for="(tag,i) in textTop">
            <p>{{tag}}</p>
          </li>
        </ul>
        <ul class="dateItem">
          <li v-for="(item,i) in list" @click="clickDay(item,i)" :class="[{isMark:item.isMark},
          {isHide:item.otherMonth!=='nowMonth'},
            {isHideWant:item.dayHide},
            {isToday:item.isToday},
            {isSelect:item.chooseDay},
            setClass(item)]">
            <p>
              {{item.id}}</p>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<style src="../css/calendar.css"></style>

<script>
  import timeUtil from "../utils/Calendar";

  export default {
    data() {
      return {
        myDate: [],
        list: [],
        historyChose: [],
        dateTop: [],
        YM: {
          year: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
          month: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        }
      };
    },
    props: {
      markDate: {
        type: Array,
        default: () => []
      },
      markDateMore: {
        type: Array,
        default: () => []
      },
      textTop: {
        type: Array,
        default: () => ["一", "二", "三", "四", "五", "六", "日"]
      },
      sundayStart: {
        type: Boolean,
        default: () => false
      },
      agoDayHide: {
        type: String,
        default: `0`
      },
      futureDayHide: {
        type: String,
        default: `2524608000`
      }
    },
    created() {
      this.intStart();
      this.myDate = new Date();
    },
    methods: {
      intStart() {
        timeUtil.sundayStart = this.sundayStart;
      },
      setClass(data) {
        let obj = {};
        obj[data.markClassName] = data.markClassName;
        return obj;
      },
      clickDay: function (item, i) {
        if (item.otherMonth === "nowMonth" && !item.dayHide) {
          this.getList(this.myDate, item.date);
        }
        if (item.otherMonth !== "nowMonth") {
          item.otherMonth === "preMonth" ? this.PreMonth(item.date) : this.NextMonth(item.date);
        }
      },
      ChoseMonth: function (date, isChosedDay = true) {
        date = timeUtil.dateFormat(date);
        this.myDate = new Date(date);
        this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
        if (isChosedDay) {
          this.getList(this.myDate, date, isChosedDay);
        } else {
          this.getList(this.myDate);
        }
      },
      PreMonth: function (date, isChosedDay = true) {
        date = timeUtil.dateFormat(date);
        this.myDate = timeUtil.getOtherMonth(this.myDate, "preMonth");
        this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
        if (isChosedDay) {
          this.getList(this.myDate, date, isChosedDay);
        } else {
          this.getList(this.myDate);
        }
      },
      NextMonth: function (date, isChosedDay = true) {
        date = timeUtil.dateFormat(date);
        this.myDate = timeUtil.getOtherMonth(this.myDate, "nextMonth");
        this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
        console.log(this.myDate, "nextMMMM")
        if (isChosedDay) {
          this.getList(this.myDate, date, isChosedDay);
        } else {
          this.getList(this.myDate);
        }
      },
      changeYM() {
        var date = this.dateTop[0] + "/" + (this.dateTop[1] + 1) + "/" + this.myDate.getDate();
        this.myDate = new Date(date);
        this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
        this.getList(this.myDate);
      },
      forMatArgs: function () {
        let markDate = this.markDate;
        let markDateMore = this.markDateMore;
        markDate = markDate.map(k => {
          return timeUtil.dateFormat(k);
        });
        markDateMore = markDateMore.map(k => {
          k.date = timeUtil.dateFormat(k.date);
          return k;
        });
        return [markDate, markDateMore];
      },
      getList: function (date, chooseDay, isChosedDay = true) {
        const [markDate, markDateMore] = this.forMatArgs();
        this.dateTop = [date.getFullYear(), date.getMonth()];
        let arr = timeUtil.getMonthList(this.myDate);
        for (let i = 0; i < arr.length; i++) {
          let markClassName = "";
          let k = arr[i];
          k.chooseDay = false;
          const nowTime = k.date;
          const t = new Date(nowTime).getTime() / 1000;
          //看每一天的class
          for (const c of markDateMore) {
            if (c.date === nowTime) {
              markClassName = c.className || "";
            }
          }
          //标记选中某些天 设置class
          k.markClassName = markClassName;
          k.isMark = markDate.indexOf(nowTime) > -1;
          //无法选中某天
          k.dayHide = t < this.agoDayHide || t > this.futureDayHide;
          if (k.isToday) {
            //this.$emit("isToday", nowTime);
          }
          let flag = !k.dayHide && k.otherMonth === "nowMonth";
          if (chooseDay && chooseDay === nowTime && flag) {
            this.$emit("choseDay", nowTime);
            this.historyChose.push(nowTime);
            k.chooseDay = true;
          } else if (this.historyChose[this.historyChose.length - 1] === nowTime && !chooseDay && flag) {
            k.chooseDay = true;
          }
        }
        this.list = arr;
      }
    },
    mounted() {
      this.getList(this.myDate);
    },
    watch: {
      markDate: {
        handler(val, oldVal) {
          this.getList(this.myDate);
        },
        deep: true
      },
      markDateMore: {
        handler(val, oldVal) {
          this.getList(this.myDate);
        },
        deep: true
      },
      agoDayHide: {
        handler(val, oldVal) {
          this.getList(this.myDate);
        },
        deep: true
      },
      futureDayHide: {
        handler(val, oldVal) {
          this.getList(this.myDate);
        },
        deep: true
      },
      sundayStart: {
        handler(val, oldVal) {
          this.intStart();
          this.getList(this.myDate);
        },
        deep: true
      }
    }
  };
</script>