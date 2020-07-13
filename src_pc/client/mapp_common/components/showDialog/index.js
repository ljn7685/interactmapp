import {events} from "mapp_common/utils/eventManager";
import {isObject,NOOP} from "mapp_common/utils";

export function showConfirmDialog ({
        title = '温馨提示',
        content,
        confirmText = '确定',
        cancelText = '取消',
        onOk = NOOP,
        onCancel = NOOP,
        onClose = NOOP,
        showCancel = true,
    }) {
    showDialog({
        name:'ConfirmDialog',
        props:{ title, content, confirmText, cancelText, onOk, onCancel, showCancel, onClose },
    });
}

function showDialog (...args) {
    if (isObject(args[0])) {
        events.showDialog.emit(args[0]);
    } else {
        events.showDialog.emit({
            name: args[0],
            props: args[1],
        });
    }
}
