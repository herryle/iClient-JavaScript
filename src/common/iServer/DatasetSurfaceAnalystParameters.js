/* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import {SuperMap} from '../SuperMap';
import {Util} from '../commontypes/Util';
import {FilterParameter} from './FilterParameter';
import {SurfaceAnalystParameters} from './SurfaceAnalystParameters';
import {ServerGeometry} from './ServerGeometry';
import {Geometry} from '../commontypes/Geometry';

/**
 * @class SuperMap.DatasetSurfaceAnalystParameters
 * @category iServer SpatialAnalyst SurfaceAnalyst
 * @classdesc 数据集表面分析参数类。该类对数据集表面分析所用到的参数进行设置。
 * @param {Object} options - 参数。 
 * @param {string} options.dataset - 要用来做数据集表面分析的数据源中数据集的名称。 
 * @param {string} options.zValueFieldName - 获取或设置用于提取操作的字段名称。 
 * @param {number} options.resolution - 获取或设置指定中间结果（栅格数据集）的分辨率。 
 * @param {SuperMap.SurfaceAnalystParametersSetting} options.extractParameter - 表面分析参数设置类。获取或设置表面分析参数。 
 * @param {SuperMap.FilterParameter} [options.filterQueryParameter] - 获取或设置查询过滤条件参数。 
 * @param {SuperMap.DataReturnOption} [options.resultSetting] - 结果返回设置类。 
 * @param {SuperMap.SurfaceAnalystMethod} [options.surfaceAnalystMethod=SuperMap.SurfaceAnalystMethod.ISOLINE] - 获取或设置表面分析的提取方法，提取等值线和提取等值面。 
 * @extends {SuperMap.SurfaceAnalystParameters}
 */
export class DatasetSurfaceAnalystParameters extends SurfaceAnalystParameters {


    constructor(options) {
        super(options);
        /**
         * @member {string} SuperMap.DatasetSurfaceAnalystParameters.prototype.dataset
         * @description 要用来做数据集表面分析的数据源中数据集的名称。该名称用形如 "数据集名称@数据源别名" 形式来表示，例如：Country@World。
         */
        this.dataset = null;

        /**
         *  @member {SuperMap.FilterParameter} SuperMap.DatasetSurfaceAnalystParameters.prototype.filterQueryParameter
         *  @description 获取或设置查询过滤条件参数。
         */
        this.filterQueryParameter = new FilterParameter();

        /**
         * @member {string} SuperMap.DatasetSurfaceAnalystParameters.prototype.zValueFieldName
         * @description 获取或设置用于提取操作的字段名称。提取等值线时，将使用该字段中的值，对点记录集中的点数据进行插值分析，得到栅格数据集（中间结果），接着从栅格数据集提取等值线。
         */
        this.zValueFieldName = null;

        if (options) {
            Util.extend(this, options);
        }

        this.CLASS_NAME = "SuperMap.DatasetSurfaceAnalystParameters";
    }

    /**
     * @function SuperMap.DatasetSurfaceAnalystParameters.prototype.destroy
     * @override
     */
    destroy() {
        super.destroy();
        var me = this;
        me.dataset = null;
        if (me.filterQueryParameter) {
            me.filterQueryParameter.destroy();
            me.filterQueryParameter = null;
        }
        me.zValueFieldName = null;
    }

    /**
     * @function SuperMap.DatasetSurfaceAnalystParameters.toObject
     * @param {SuperMap.DatasetSurfaceAnalystParameters} datasetSurfaceAnalystParameters - 数据集表面分析参数类。
     * @param {SuperMap.DatasetSurfaceAnalystParameters} tempObj - 数据集表面分析参数对象。
     * @description 将数据集表面分析参数对象转换为 JSON 对象。
     * @returns JSON 对象。
     */
    static toObject(datasetSurfaceAnalystParameters, tempObj) {
        for (var name in datasetSurfaceAnalystParameters) {
            if (name === "filterQueryParameter") {
                tempObj.filterQueryParameter = datasetSurfaceAnalystParameters.filterQueryParameter;
            }
            if (name === "extractParameter") {
                if (datasetSurfaceAnalystParameters.extractParameter.clipRegion instanceof Geometry && datasetSurfaceAnalystParameters.extractParameter.clipRegion.components) {
                    datasetSurfaceAnalystParameters.extractParameter.clipRegion = ServerGeometry.fromGeometry(datasetSurfaceAnalystParameters.extractParameter.clipRegion);
                }
                tempObj.extractParameter = datasetSurfaceAnalystParameters.extractParameter;
            } else if (name === "dataset") {
                continue;
            } else if (name === "surfaceAnalystMethod") {
                continue;
            } else {
                tempObj[name] = datasetSurfaceAnalystParameters[name];
            }
        }
    }

}

SuperMap.DatasetSurfaceAnalystParameters = DatasetSurfaceAnalystParameters;