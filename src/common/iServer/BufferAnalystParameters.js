/* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import {SuperMap} from '../SuperMap';
import {Util} from '../commontypes/Util';
import {BufferSetting} from './BufferSetting';

/**
 * @class SuperMap.BufferAnalystParameters
 * @category iServer SpatialAnalyst BufferAnalyst
 * @classdesc 缓冲区分析参数基类。
 * @param {Object} options - 参数。 
 * @param {SuperMap.BufferSetting} [options.bufferSetting] - 设置缓冲区通用参数。为缓冲区分析提供必要的参数信息，包括左缓冲距离、右缓冲距离、端点类型、圆头缓冲圆弧处线段的个数信息。
 */
export class BufferAnalystParameters {


    constructor(options) {
        var me = this;
        /**
         * @member {SuperMap.BufferSetting} [SuperMap.BufferAnalystParameters.prototype.bufferSetting]
         * @description 设置缓冲区通用参数。为缓冲区分析提供必要的参数信息，包括左缓冲距离、右缓冲距离、端点类型、圆头缓冲圆弧处线段的个数信息。
         */
        me.bufferSetting = new BufferSetting();
        Util.extend(this, options);
        this.CLASS_NAME = "SuperMap.BufferAnalystParameters";
    }


    /**
     * @function SuperMap.BufferAnalystParameters.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
        var me = this;
        if (me.bufferSetting) {
            me.bufferSetting.destroy();
            me.bufferSetting = null;
        }
    }


}

SuperMap.BufferAnalystParameters = BufferAnalystParameters;