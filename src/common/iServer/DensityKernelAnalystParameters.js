/* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import {SuperMap} from '../SuperMap';
import {Util} from '../commontypes/Util';

/**
 * @class SuperMap.DensityKernelAnalystParameters
 * @category  iServer SpatialAnalyst DensityAnalyst
 * @classdesc 核密度分析参数类。
 * @param {Object} options - 参数。
 * @param {string} options.dataset - 要用来做核密度分析数据源中数据集的名称。该名称用形如 "数据集名称@数据源别名" 形式来表示，例如：BaseMap_P@Jingjin。 
 * @param {string} options.fieldName - 用于进行核密度分析的测量值的字段名称，核密度分析不支持文本类型的字段。 
 * @param {string} options.resultGridName - 指定结果数据集名称。 
 * @param {(SuperMap.Bounds|L.Bounds|ol.extent)} [options.bounds] - 核密度分析的范围，用于确定结果栅格数据集的范围。如果缺省，则默认为原数据集的范围。 
 * @param {number} [options.searchRadius] - 栅格邻域内用于计算密度的查找半径，单位与当前数据集相同。默认值为当前数据集的长宽中的最大值除30。 
 * @param {number} [options.resultGridDatasetResolution] - 密度分析结果栅格数据的分辨率，单位与当前数据集相同。默认值为当前数据集的长宽中的最小值除500。 
 * @param {string} [options.targetDatasource] - 指定的存储结果数据集的数据源，默认为当前分析的数据集所在的数据源。 
 * @param {boolean} [options.deleteExistResultDataset=false] - 如果用户命名的结果数据集名称与已有的数据集重名，是否删除已有的数据集。 
 */
export class DensityKernelAnalystParameters {


    constructor(options) {
        /**
         * @member {string} SuperMap.DensityKernelAnalystParameters.prototype.dataset
         * @description 要用来做核密度分析数据源中数据集的名称。
         * 该名称用形如 "数据集名称@数据源别名" 形式来表示，例如：Railway@Changchun。
         * 注：核密度分析支持点数据集和线数据集。
         */
        this.dataset = null;

        /**
         * @member {(SuperMap.Bounds|L.Bounds|ol.extent)} [SuperMap.DensityKernelAnalystParameters.prototype.bounds]
         * @description 核密度分析的范围，用于确定结果栅格数据集的范围。
         * 如果缺省，则默认为原数据集的范围。
         */
        this.bounds = null;

        /**
         * @member {string} SuperMap.DensityKernelAnalystParameters.prototype.fieldName
         * @description 用于进行核密度分析的测量值的字段名称，核密度分析不支持文本类型的字段。
         */
        this.fieldName = null;

        /**
         * @member {number} [SuperMap.DensityKernelAnalystParameters.prototype.resultGridDatasetResolution]
         * @description 密度分析结果栅格数据的分辨率，单位与当前数据集相同。默认值为当前数据集的长宽中的最小值除500。
         */
        this.resultGridDatasetResolution = null;

        /**
         * @member {number} [SuperMap.DensityKernelAnalystParameters.prototype.searchRadius]
         * @description 栅格邻域内用于计算密度的查找半径，单位与当前数据集相同。默认值为当前数据集的长宽中的最大值除30。
         */
        this.searchRadius = null;

        /**
         * @member {string} [SuperMap.DensityKernelAnalystParameters.prototype.targetDatasource]
         * @description 指定的存储结果数据集的数据源，默认为当前分析的数据集所在的数据源。
         */
        this.targetDatasource = null;

        /**
         * @member {string} SuperMap.DensityKernelAnalystParameters.prototype.resultGridName
         * @description 指定结果数据集名称。
         */
        this.resultGridName = null;

        /**
         * @member {boolean} [SuperMap.DensityKernelAnalystParameters.prototype.deleteExistResultDataset=false]
         * @description 如果用户命名的结果数据集名称与已有的数据集重名，是否删除已有的数据集。
         */
        this.deleteExistResultDataset = false;
        Util.extend(this, options);

        this.CLASS_NAME = "SuperMap.DensityKernelAnalystParameters";

    }


    /**
     * @function SuperMap.DensityKernelAnalystParameters.prototype.destroy
     * @description 释放资源，将引用资源的属性置空。
     */
    destroy() {
        var me = this;
        me.dataset = null;
        me.bounds = null;
        me.fieldName = null;
        me.resultGridDatasetResolution = null;
        me.searchRadius = null;

        me.targetDatasource = null;
        me.resultGridName = null;
        me.deleteExistResultDataset = null;
    }

    /**
     * @function SuperMap.DensityKernelAnalystParameters.toObject
     * @param {SuperMap.DensityKernelAnalystParameters} densityKernelAnalystParameters -核密度分析参数类。
     * @param {SuperMap.DensityKernelAnalystParameters} tempObj - 核密度分析参数对象。
     * @description 将核密度分析参数对象转换成 JSON 对象。
     * @returns JSON 对象。
     */
    static toObject(densityKernelAnalystParameters, tempObj) {
        for (var name in densityKernelAnalystParameters) {
            if (name !== "dataset") {
                tempObj[name] = densityKernelAnalystParameters[name];
            }
        }
    }

}

SuperMap.DensityKernelAnalystParameters = DensityKernelAnalystParameters;
