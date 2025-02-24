/* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import {SuperMap} from '../SuperMap';
import {Util} from '../commontypes/Util';
import {UGCSubLayer} from './UGCSubLayer';
import {ServerStyle} from './ServerStyle';

/**
 * @class SuperMap.Vector
 * @category  iServer Map TileFeature
 * @classdesc UGC 矢量图层类。
 * @extends {SuperMap.UGCSubLayer}
 * @param {Object} options - 参数。
 * @param {SuperMap.ServerStyle} [options.style] - 矢量图层的风格。
 */

export class Vector extends UGCSubLayer {

    constructor(options) {
        options = options || {};
        super(options);
        /**
         * @member {SuperMap.ServerStyle} SuperMap.Vector.prototype.style
         * @description 矢量图层的风格。
         */
        this.style = null;

        this.CLASS_NAME = "SuperMap.Vector";
    }

    /**
     * @function SuperMap.Vector.prototype.destroy
     * @override
     */
    destroy() {
        super.destroy();
        Util.reset(this);
    }

    /**
     * @function SuperMap.Vector.prototype.fromJson
     * @description 将服务端 JSON 对象转换成当前客户端对象。
     * @param {Object} jsonObject - 要转换的 JSON 对象。
     */
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        var sty = this.style;
        if (sty) {
            this.style = new ServerStyle(sty);
        }
    }

    /**
     * @function SuperMap.Vector.prototype.toServerJSONObject
     * @description 转换成对应的 JSON 格式对象。
     * @returns {Object} 对应的 JSON 格式对象
     */
    toServerJSONObject() {
        var jsonObject = SuperMap.toServerJSONObject();
        if (jsonObject.style) {
            if (jsonObject.style.toServerJSONObject) {
                jsonObject.style = jsonObject.style.toServerJSONObject();
            }
        }
        return jsonObject;
    }
}

SuperMap.Vector = Vector;
