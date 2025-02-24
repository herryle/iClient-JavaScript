/* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import {SuperMap} from '../SuperMap';
import {Util} from '../commontypes/Util';

/**
 * @class SuperMap.ThiessenAnalystParameters
 * @category  iServer SpatialAnalyst ThiessenPolygonAnalyst
 * @classdesc 泰森多边形分析参数基类。
 * @param {Object} options - 参数。
 * @param {(SuperMap.Geometry.Polygon|L.Polygon|ol.geom.Polygon)} [options.clipRegion] - 结果数据裁剪区域，可以为 null，表示不对结果进行裁剪。
 * @param {boolean} [options.createResultDataset=false] - 是否返回结果数据集。
 * @param {string} [options.resultDatasetName] - 指定结果数据集名称。
 * @param {string} [options.resultDatasourceName] - 指定结果数据集所在数据源，默认为当前数据源。
 * @param {boolean} [options.returnResultRegion=true] - 是否返回分析得到的多边形面数组。
 */
export class ThiessenAnalystParameters {

    constructor(options) {
        if (!options) {
            return;
        }
        /**
         * @member {(SuperMap.Geometry.Polygon|L.Polygon|ol.geom.Polygon)} [SuperMap.ThiessenAnalystParameters.prototype.clipRegion]
         * @description 结果数据裁剪区域，可以为 null，表示不对结果进行裁剪。
         */
        this.clipRegion = null;

        /**
         *  @member {boolean} [SuperMap.ThiessenAnalystParameters.prototype.createResultDataset=false]
         *  @description 是否返回结果数据集。如果为 true，则必须设置属性 resultDatasetName 和 resultDatasourceName。
         */
        this.createResultDataset = false;

        /**
         * @member {string} SuperMap.ThiessenAnalystParameters.prototype.resultDatasetName
         * @description 指定结果数据集名称。
         */
        this.resultDatasetName = null;

        /**
         * @member {string} SuperMap.ThiessenAnalystParameters.prototype.resultDatasourceName
         * @description 指定结果数据集所在数据源。
         */
        this.resultDatasourceName = null;

        /**
         * @member {boolean} SuperMap.ThiessenAnalystParameters.prototype.returnResultRegion
         * @description 是否返回分析得到的多边形面数组。
         */
        this.returnResultRegion = true;

        Util.extend(this, options);

        this.CLASS_NAME = "SuperMap.ThiessenAnalystParameters";
    }

    /**
     * @function SuperMap.ThiessenAnalystParameters.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
        var me = this;
        if (me.clipRegion) {
            me.clipRegion.destroy();
            me.clipRegion = null;
        }
        me.createResultDataset = null;
        me.resultDatasetName = null;
        me.resultDatasourceName = null;
        me.returnResultRegion = null;
    }

}

SuperMap.ThiessenAnalystParameters = ThiessenAnalystParameters;