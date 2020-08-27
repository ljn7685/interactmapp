import React, { Component } from 'react';
import { View, Text } from "@tarojs/components";
import PickerView from "../pickerView";
import propTypes from 'prop-types';
import "./index.scss";

const timeData = [
    [{ "value":0, "label":"0时" }, { "value":1, "label":"1时" }, { "value":2, "label":"2时" }, { "value":3, "label":"3时" }, { "value":4, "label":"4时" }, { "value":5, "label":"5时" }, { "value":6, "label":"6时" }, { "value":7, "label":"7时" }, { "value":8, "label":"8时" }, { "value":9, "label":"9时" }, { "value":10, "label":"10时" }, { "value":11, "label":"11时" }, { "value":12, "label":"12时" }, { "value":13, "label":"13时" }, { "value":14, "label":"14时" }, { "value":15, "label":"15时" }, { "value":16, "label":"16时" }, { "value":17, "label":"17时" }, { "value":18, "label":"18时" }, { "value":19, "label":"19时" }, { "value":20, "label":"20时" }, { "value":21, "label":"21时" }, { "value":22, "label":"22时" }, { "value":23, "label":"23时" }],
    [{ "value":0, "label":"0分" }, { "value":1, "label":"1分" }, { "value":2, "label":"2分" }, { "value":3, "label":"3分" }, { "value":4, "label":"4分" }, { "value":5, "label":"5分" }, { "value":6, "label":"6分" }, { "value":7, "label":"7分" }, { "value":8, "label":"8分" }, { "value":9, "label":"9分" }, { "value":10, "label":"10分" }, { "value":11, "label":"11分" }, { "value":12, "label":"12分" }, { "value":13, "label":"13分" }, { "value":14, "label":"14分" }, { "value":15, "label":"15分" }, { "value":16, "label":"16分" }, { "value":17, "label":"17分" }, { "value":18, "label":"18分" }, { "value":19, "label":"19分" }, { "value":20, "label":"20分" }, { "value":21, "label":"21分" }, { "value":22, "label":"22分" }, { "value":23, "label":"23分" }, { "value":24, "label":"24分" }, { "value":25, "label":"25分" }, { "value":26, "label":"26分" }, { "value":27, "label":"27分" }, { "value":28, "label":"28分" }, { "value":29, "label":"29分" }, { "value":30, "label":"30分" }, { "value":31, "label":"31分" }, { "value":32, "label":"32分" }, { "value":33, "label":"33分" }, { "value":34, "label":"34分" }, { "value":35, "label":"35分" }, { "value":36, "label":"36分" }, { "value":37, "label":"37分" }, { "value":38, "label":"38分" }, { "value":39, "label":"39分" }, { "value":40, "label":"40分" }, { "value":41, "label":"41分" }, { "value":42, "label":"42分" }, { "value":43, "label":"43分" }, { "value":44, "label":"44分" }, { "value":45, "label":"45分" }, { "value":46, "label":"46分" }, { "value":47, "label":"47分" }, { "value":48, "label":"48分" }, { "value":49, "label":"49分" }, { "value":50, "label":"50分" }, { "value":51, "label":"51分" }, { "value":52, "label":"52分" }, { "value":53, "label":"53分" }, { "value":54, "label":"54分" }, { "value":55, "label":"55分" }, { "value":56, "label":"56分" }, { "value":57, "label":"57分" }, { "value":58, "label":"58分" }, { "value":59, "label":"59分" }], 
    [{ "value":0, "label":"0秒" }, { "value":1, "label":"1秒" }, { "value":2, "label":"2秒" }, { "value":3, "label":"3秒" }, { "value":4, "label":"4秒" }, { "value":5, "label":"5秒" }, { "value":6, "label":"6秒" }, { "value":7, "label":"7秒" }, { "value":8, "label":"8秒" }, { "value":9, "label":"9秒" }, { "value":10, "label":"10秒" }, { "value":11, "label":"11秒" }, { "value":12, "label":"12秒" }, { "value":13, "label":"13秒" }, { "value":14, "label":"14秒" }, { "value":15, "label":"15秒" }, { "value":16, "label":"16秒" }, { "value":17, "label":"17秒" }, { "value":18, "label":"18秒" }, { "value":19, "label":"19秒" }, { "value":20, "label":"20秒" }, { "value":21, "label":"21秒" }, { "value":22, "label":"22秒" }, { "value":23, "label":"23秒" }, { "value":24, "label":"24秒" }, { "value":25, "label":"25秒" }, { "value":26, "label":"26秒" }, { "value":27, "label":"27秒" }, { "value":28, "label":"28秒" }, { "value":29, "label":"29秒" }, { "value":30, "label":"30秒" }, { "value":31, "label":"31秒" }, { "value":32, "label":"32秒" }, { "value":33, "label":"33秒" }, { "value":34, "label":"34秒" }, { "value":35, "label":"35秒" }, { "value":36, "label":"36秒" }, { "value":37, "label":"37秒" }, { "value":38, "label":"38秒" }, { "value":39, "label":"39秒" }, { "value":40, "label":"40秒" }, { "value":41, "label":"41秒" }, { "value":42, "label":"42秒" }, { "value":43, "label":"43秒" }, { "value":44, "label":"44秒" }, { "value":45, "label":"45秒" }, { "value":46, "label":"46秒" }, { "value":47, "label":"47秒" }, { "value":48, "label":"48秒" }, { "value":49, "label":"49秒" }, { "value":50, "label":"50秒" }, { "value":51, "label":"51秒" }, { "value":52, "label":"52秒" }, { "value":53, "label":"53秒" }, { "value":54, "label":"54秒" }, { "value":55, "label":"55秒" }, { "value":56, "label":"56秒" }, { "value":57, "label":"57秒" }, { "value":58, "label":"58秒" }, { "value":59, "label":"59秒" }],
];

class DatePicker extends Component {
    constructor (props) {
        super(props);
        this.state = {
            mode: 'date', // date:选择日期模式, time:选择时间模式
            startDate: null, // 最早可选日期
            endDate: null, // 最晚可选日期
            currentDate: null, // 当前月日期
            currentDateStr: null, // 2018-12
            selectedDate: null, // 选中日期
            selectedDateStr: null, // 选中日期字符格式,用于和dayStr比较
            selectedDateShow: null, // 选中日期显示 2018-12-12
            currentData: null, // 当前渲染数据
            initTimeValue: [0, 0, 0], // 初始化选中时间的时,分,秒
            timeValue: [0, 0, 0], // 选中时间的时,分,秒，
        };
    }
    componentDidMount () {
        let { rangeStart, rangeEnd, date } = this.props;
        this.initRangeStart(rangeStart);
        this.initRangeEnd(rangeEnd);
        this.initDate(date);
    }
    componentDidUpdate (prevProps, prevState) {
        const { date, rangeStart, rangeEnd  } = this.props;
        const { currentDate } = this.state;
        if (prevProps.date !== date) {
            this.initDate(date);
        }
        if (prevState.currentDate !== currentDate) {
            this.setMonthData();
        }
        if (prevProps.rangeStart !== rangeStart) {
            this.initRangeStart(rangeStart);
        }
        if (prevProps.rangeEnd !== rangeEnd) {
            this.initRangeEnd(rangeEnd);
        }
    }
    /**
	 * pickview change回调
	 * @param {*} e 
	 */
    bindChange (values) {
        // const values = e.detail.value;
        this.setState({ timeValue: values });
    }
    /**
	 *  切换模式
	 */
    toggleMode () {
        if (this.state.mode === 'date') {
            let date = this.props.date ? new Date(this.props.date) : new Date();
            let hour = date.getHours();
            let minute = date.getMinutes();
            let second = date.getSeconds();
            this.setState({
                initTimeValue: [hour, minute, second],
                timeValue: [hour, minute, second],
                mode: 'time',
            });
        } else {
            this.setState({ mode: 'date' });
        }
    }
    /**
	 * 取消按钮点击
	 */
    cancel () {
        setTimeout(() => {
            this.setState({ mode: 'date' });
        }, 300);
        this.initDate(this.props.date);
        this.props.onSelect();
    }
    /**
	 * 确定按钮点击
	 */
    confirm () {
        this.setState({ mode: 'date' });
        let selectedDate = this.state.selectedDate;
        let year = selectedDate.getFullYear(), month = selectedDate.getMonth(), day = selectedDate.getDate();
        let timeValue = this.state.timeValue;
        let newDate = new Date(year, month, day, timeValue[0], timeValue[1], timeValue[2]);
        let dateStr = [year, month + 1, day].map(this.fixZero).join('-');
        let dateTimeStr = [year, month + 1, day].map(this.fixZero).join('-') + ' ' + timeValue.map(this.fixZero).join(':');
        this.props.onSelect({ date: newDate, dateStr: dateStr, dateTimeStr: dateTimeStr });
    }
    /**
	 * 验证日期有效
	 * @param {*} date 
	 */
    isValidDay (date) {
        let { startDate, endDate } = this.state;
        const { needWeek } = this.props;

        let valid = false;

        if (startDate && endDate) { // 开始日期和结束日期都存在
            if (date >= startDate && date < endDate) {
                valid = true;
            }
        } else if (startDate && !endDate) { // 开始日期存在结束日期不存在
            if (date >= startDate) {
                valid = true;
            }
        } else if (!startDate && endDate) { // 开始日期不存在结束日期存在
            if (date < endDate) {
                valid = true;
            }
        } else {
            valid = true;
        }

        if (!needWeek) {
            let weekDay = date.getDay();
            if (weekDay === 0 || weekDay === 6) {
                valid = false;
            }
        }
        return valid;
    }
    /**
	 * 设置月份数据
	 */
    setMonthData () {

        const currentDate = this.state.currentDate;
        let year = currentDate.getFullYear(), month = currentDate.getMonth();

        // 当月所有天数的数据结构
        let currentData = [];

        // 获取当月1号的星期0~6
        let firstDayWeek = new Date(year, month, 1).getDay();

        // 天数, 用来标识当前是本月中的哪一天
        let dayIndex = 0;

        // 第1行
        let firstCol = [];

        for (let i = 0; i < 7; i++) {
            if (i < firstDayWeek) {
                let date = new Date(year, month, dayIndex - (firstDayWeek - i) + 1);
                let valid = this.isValidDay(date);
                firstCol.push({
                    date: date,
                    dateStr: date.toString(),
                    day: date.getDate(),
                    valid: valid,
                    currentMonth: false,
                });
            } else {
                dayIndex += 1;
                let date = new Date(year, month, dayIndex);
                let valid = this.isValidDay(date);
                firstCol.push({
                    date: date,
                    dateStr: date.toString(),
                    day: dayIndex,
                    valid: valid,
                    currentMonth: true,
                });
            }
        }

        currentData.push(firstCol);
        // 第2～4行
        for (let i = 0; i < 3; i++) {
            let col = [];
            for (let j = 0; j < 7; j++) {
                dayIndex += 1;
                let date = new Date(year, month, dayIndex);
                let valid = this.isValidDay(date);
                col.push({
                    date: date,
                    dateStr: date.toString(),
                    day: dayIndex,
                    valid: valid,
                    currentMonth: true,
                });
            }
            currentData.push(col);
        }

        // 第5行
        let lastCol = [];

        // 余下一行中本月的天数
        let restDay = new Date(year, month + 1, 0).getDate() - dayIndex;

        for (let i = 0; i < 7; i++) {
            if (i < restDay) {
                dayIndex += 1;
                let date = new Date(year, month, dayIndex);
                let valid = this.isValidDay(date);
                lastCol.push({
                    date: date,
                    dateStr: date.toString(),
                    day: dayIndex,
                    valid: valid,
                    currentMonth: true,
                });
            } else {
                let date = new Date(year, month + 1, i - restDay + 1);
                let valid = this.isValidDay(date);
                lastCol.push({
                    date: date,
                    dateStr: date.toString(),
                    day: date.getDate(),
                    valid: valid,
                    currentMonth: false,
                });
            }
        }

        currentData.push(lastCol);

        let restDay2 = restDay - 7;

        // 第6行
        let lastCol2 = [];

        for (let i = 0; i < 7; i++) {
            if (i < restDay2) {
                dayIndex += 1;
                let date = new Date(year, month, dayIndex);
                let valid = this.isValidDay(date);
                lastCol2.push({
                    date: date,
                    dateStr: date.toString(),
                    day: dayIndex,
                    valid: valid,
                    currentMonth: true,
                });
            } else {
                let date = new Date(year, month + 1, i - restDay2 + 1);
                let valid = this.isValidDay(date);
                lastCol2.push({
                    date: date,
                    dateStr: date.toString(),
                    day: date.getDate(),
                    valid: valid,
                    currentMonth: false,
                });
            }
        }

        currentData.push(lastCol2);

        this.setState({ currentData: currentData });
    }
    /**
	 * 改变日期
	 * @param {*} event 
	 */
    changeDate (type) {
        let currentDate = this.state.currentDate;
        let year = currentDate.getFullYear(), month = currentDate.getMonth();
        switch (type) {
            case 'year-':
                currentDate.setFullYear(year - 1);
                break;
            case 'year+':
                currentDate.setFullYear(year + 1);
                break;
            case 'month-':
                currentDate.setMonth(month - 1);
                break;
            case 'month+':
                currentDate.setMonth(month + 1);
                break;
        }

        this.setCurrentDate(currentDate);

    }
    /**
	 * 选择日期
	 * @param {*} event 
	 */
    chooseDate (i, j) {

        let td = this.state.currentData[i][j];

        if (td.valid) {
            this.setSelectedDate(td.date);
        }

    }
    /**
	 * 数字前面添加0
	 * @param {*} value 
	 */
    fixZero (value) {
        if (value < 10) {
            return "0" + value;
        } else {
            return value;
        }
    }
    /**
	 * 设置当前日期
	 * @param {*} date 
	 */
    setCurrentDate (date) {
        if (!date) {
            this.setState({
                currentDate: null,
                currentDateStr: null,
            });
        } else {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const dateStr = [year, month].map(this.fixZero).join('-');
            this.setState({
                currentDate: new Date(date.getTime()),
                currentDateStr: dateStr,
            });
        }
    }
    /**
	 * 设置选择日期
	 * @param {*} date 
	 */
    setSelectedDate (date) {
        if (!date) {
            this.setState({
                selectedDate: null,
                selectedDateStr: null,
                selectedDateShow: null,
            });
            return;
        } else {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const selectedDateShow = [year, month, day].map(this.fixZero).join('-');
            this.setState({
                selectedDate: date,
                selectedDateStr: date.toString(),
                selectedDateShow: selectedDateShow,
            });
        }
    }
    /**
	 * 初始化开始范围
	 * @param {*} value 
	 */
    initRangeStart (value) {
        if (value) {
            let date = new Date(value);
            this.setState({ startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()) });
        }
    }
    /**
	 * 初始化结束范围
	 * @param {*} value 
	 */
    initRangeEnd (value) {
        if (value) {
            let date = new Date(value);
            this.setState({ endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 24) });
        }
    }
    /**
	 * 初始化日期
	 * @param {*} value 
	 */
    initDate (value) {
        let date = value ? new Date(value) : new Date();
        let year = date.getFullYear(), month = date.getMonth(), day = date.getDate();
        this.setCurrentDate(new Date(year, month, day));
        this.setSelectedDate(new Date(year, month, day));
    }
    render () {
        const { pickerShow } = this.props;
        const { mode, currentDateStr, timeValue, selectedDateStr, selectedDateShow, currentData, initTimeValue } = this.state;
        return (<View>
            <View className={`modal ${pickerShow ? 'modal-show' : 'modal-hide'}`} catchtouchmove='true' onClick={this.cancel.bind(this)}></View>
            <View className={`picker ${pickerShow ? 'picker-show' : 'picker-hide'}`}>
                {mode === 'date' && <View className='date-header' >
                    <View className='btn doubleLeft' onClick={this.changeDate.bind(this, 'year-')} >
                        <Text className='iconfont-picker icon-arrow-double-left'></Text>
                    </View>
                    <View className='btn left' onClick={this.changeDate.bind(this, 'month-')} >
                        <Text className='iconfont-picker icon-arrow-left'></Text>
                    </View>
                    <View className='month'>
                        {currentDateStr}
                    </View>
                    <View className='btn right' onClick={this.changeDate.bind(this, 'month+')} >
                        <Text className='iconfont-picker icon-arrow-right'></Text>
                    </View>
                    <View className='btn doubleRight' onClick={this.changeDate.bind(this, 'year+')} >
                        <Text className='iconfont-picker icon-arrow-double-right'></Text>
                    </View>
                </View>}
                {mode === 'date' && <View className='date-body' >
                    <View className='tr'>
                        <View className='th'>
                            <View className='cell'>日</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>一</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>二</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>三</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>四</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>五</View>
                        </View>
                        <View className='th'>
                            <View className='cell'>六</View>
                        </View>
                    </View>
                    {currentData && currentData.map((tr, i) => (
                        <View className='tr'
                            key={i}
                        >
                            {tr.map((td, j) => (
                                <View className='td'
                                    key={j}
                                    onClick={this.chooseDate.bind(this, i, j)}
                                >
                                    <View hoverClass='none'
                                        className={`cell ${td.currentMonth ? '' : 'otherMonth'} ${td.valid ? '' : 'disabled'} ${td.date && td.dateStr === selectedDateStr ? 'cur' : ''}`}
                                    >
                                        {td.day}
                                    </View>
                                </View>

                            ))}
                        </View>
                    ))}
                </View>
                }
                {mode === 'time' && <View className='time-header' >
                    <View className='date'>
                        {selectedDateShow}
                    </View>
                </View>}
                {mode === 'time' && <View className='time-body' >
                    <PickerView indicatorClass='selectItem' data={timeData} col={timeData.length} value={timeValue || initTimeValue} onChange={this.bindChange.bind(this)} className='picker-view' />
                </View>}
                <View className='bottom'>
                    {mode === 'date' && <View className='btn btn-cancel' onClick={this.cancel.bind(this)} >
                        <View hoverClass='hover' hoverStartTime='0'>取消</View>
                    </View>}
                    {mode !== 'date' && <View className='btn btn-cancel' onClick={this.toggleMode.bind(this)} >
                        <View hoverClass='hover' hoverStartTime='0'>返回</View>
                    </View>}

                    <View className='bd'></View>
                    {mode === 'date' && <View className='btn btn-confirm' onClick={this.toggleMode.bind(this)}>
                        <View hoverClass='hover' hoverStartTime='0'>选时间</View>
                    </View>}
                    {mode !== 'date' && <View className='btn btn-confirm' onClick={this.confirm.bind(this)} >
                        <View hoverClass='hover' hoverStartTime='0'>完成</View>
                    </View>}
                </View>
            </View>
        </View>);
    }
}
DatePicker.defaultProps = {
    needWeek: true,
    pickerShow: false,
};
DatePicker.propTypes = {
    date: propTypes.oneOfType([propTypes.number, propTypes.string]),
    rangeStart: propTypes.oneOfType([propTypes.number, propTypes.string]),
    rangeEnd: propTypes.oneOfType([propTypes.number, propTypes.string]),
    onSelect: propTypes.func,
    needWeek: propTypes.bool,
    pickerShow: propTypes.bool,
};

export default DatePicker;
