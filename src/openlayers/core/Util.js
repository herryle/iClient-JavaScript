/* Copyright© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import {
  Unit,
  Bounds,
  GeoJSON as GeoJSONFormat,
  FilterParameter,
  GetFeaturesBySQLParameters,
  QueryBySQLParameters,
  QueryOption
} from '@supermap/iclient-common';
import { QueryService } from '../services/QueryService';
import { FeatureService } from '../services/FeatureService';
import * as olUtil from 'ol/util';
import Geometry from 'ol/geom/Geometry';
import { getVectorContext } from 'ol/render';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Fill, Style } from 'ol/style';
import Feature from 'ol/Feature';

/**
 * @class ol.supermap.Util
 * @category BaseTypes Util
 * @classdesc 工具类。
 */
export class Util {
  constructor() {}

  static getOlVersion() {
    if (olUtil && olUtil.VERSION) {
      return olUtil.VERSION.split('.')[0];
    }
    if (window && window.ol) {
      if (window.ol.util) {
        return '6';
      }
      if (window.ol.WebGLMap) {
        return '5';
      }
    }
    return '4';
  }

  /**
   * @function ol.supermap.Util.toGeoJSON
   * @description 将传入对象转为 GeoJSON 格式。
   * @param {Object} smObj - 待转参数。
   */
  static toGeoJSON(smObj) {
    if (!smObj) {
      return null;
    }
    return new GeoJSONFormat().toGeoJSON(smObj);
  }

  /**
   * @function ol.supermap.Util.toSuperMapGeometry
   * @description 将 GeoJSON 对象转为 SuperMap 几何图形。
   * @param {GeoJSONObject} geoJSON - GeoJSON 对象。
   */
  static toSuperMapGeometry(geoJSON) {
    if (!geoJSON || !geoJSON.type) {
      return null;
    }
    const result = new GeoJSONFormat().read(geoJSON, 'FeatureCollection');
    return result[0].geometry;
  }

  /**
   * @function ol.supermap.Util.resolutionToScale
   * @description 通过分辨率计算比例尺。
   * @param {number} resolution - 分辨率。
   * @param {number} dpi - 屏幕分辨率。
   * @param {string} mapUnit - 地图单位。
   * @returns {number} 比例尺。
   */
  static resolutionToScale(resolution, dpi, mapUnit) {
    const inchPerMeter = 1 / 0.0254;
    // 地球半径。
    const meterPerMapUnit = this.getMeterPerMapUnit(mapUnit);
    const scale = 1 / (resolution * dpi * inchPerMeter * meterPerMapUnit);
    return scale;
  }

  /**
   * @function ol.supermap.Util.toSuperMapBounds
   * @description 转为 SuperMapBounds 格式。
   * @param {Array.<number>} bounds - bounds 数组。
   * @returns {SuperMap.Bounds} 返回 SuperMap 的 Bounds 对象。
   */
  static toSuperMapBounds(bounds) {
    return new Bounds(bounds[0], bounds[1], bounds[2], bounds[3]);
  }

  /**
   * @function ol.supermap.Util.toProcessingParam
   * @description 将 Region 节点数组转为 Processing 服务需要的分析参数。
   * @param {Array} points - Region 各个节点数组。
   * @returns processing 服务裁剪、查询分析的分析参数。
   */
  static toProcessingParam(points) {
    if (points.length < 1) {
      return '';
    }
    const geometryParam = {};
    const results = [];
    for (let i = 0; i < points.length; i++) {
      const point = { x: points[i][0], y: points[i][1] };
      results.push(point);
    }
    results.push(results[0]);
    geometryParam.type = 'REGION';
    geometryParam.points = results;

    return geometryParam;
  }

  /**
   * @function ol.supermap.Util.scaleToResolution
   * @description 通过比例尺计算分辨率。
   * @param {number} scale - 比例尺。
   * @param {number} dpi - 屏幕分辨率。
   * @param {string} mapUnit - 地图单位。
   * @returns {number} 分辨率。
   */
  static scaleToResolution(scale, dpi, mapUnit) {
    const inchPerMeter = 1 / 0.0254;
    const meterPerMapUnitValue = this.getMeterPerMapUnit(mapUnit);
    const resolution = 1 / (scale * dpi * inchPerMeter * meterPerMapUnitValue);
    return resolution;
  }

  /**
   * @private
   * @function ol.supermap.Util.getMeterPerMapUnit
   * @description 获取每地图单位多少米。
   * @param {string} mapUnit - 地图单位。
   * @returns {number} 返回每地图单位多少米。
   */
  static getMeterPerMapUnit(mapUnit) {
    const earchRadiusInMeters = 6378137;
    let meterPerMapUnit;
    if (mapUnit === Unit.METER) {
      meterPerMapUnit = 1;
    } else if (mapUnit === Unit.DEGREE) {
      // 每度表示多少米。
      meterPerMapUnit = (Math.PI * 2 * earchRadiusInMeters) / 360;
    } else if (mapUnit === Unit.KILOMETER) {
      meterPerMapUnit = 1.0e-3;
    } else if (mapUnit === Unit.INCH) {
      meterPerMapUnit = 1 / 2.5399999918e-2;
    } else if (mapUnit === Unit.FOOT) {
      meterPerMapUnit = 0.3048;
    } else {
      return meterPerMapUnit;
    }
    return meterPerMapUnit;
  }

  /**
   * @function ol.supermap.Util.isArray
   * @description 判断是否为数组格式。
   * @param {Object} obj - 待判断对象。
   * @returns {boolean} 是否是数组。
   */
  static isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  /**
   * @function ol.supermap.Util.Csv2GeoJSON
   * @description 将 csv 格式转为 GeoJSON。
   * @param {Object} csv - csv 对象。
   * @param {Object} options - 转换参数。
   */
  static Csv2GeoJSON(csv, options) {
    const defaultOptions = {
      titles: ['lon', 'lat'],
      latitudeTitle: 'lat',
      longitudeTitle: 'lon',
      fieldSeparator: ',',
      lineSeparator: '\n',
      deleteDoubleQuotes: true,
      firstLineTitles: false
    };
    options = options || defaultOptions;
    const _propertiesNames = [];
    if (typeof csv === 'string') {
      let titulos = options.titles;
      if (options.firstLineTitles) {
        csv = csv.split(options.lineSeparator);
        if (csv.length < 2) {
          return;
        }
        titulos = csv[0];
        csv.splice(0, 1);
        csv = csv.join(options.lineSeparator);
        titulos = titulos.trim().split(options.fieldSeparator);
        for (let i = 0; i < titulos.length; i++) {
          titulos[i] = _deleteDoubleQuotes(titulos[i]);
        }
        options.titles = titulos;
      }
      for (let i = 0; i < titulos.length; i++) {
        let prop = titulos[i]
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '_');
        if (prop === '' || prop === '_') {
          prop = `prop-${i}`;
        }
        _propertiesNames[i] = prop;
      }
      csv = _csv2json(csv);
    }
    return csv;

    function _deleteDoubleQuotes(cadena) {
      if (options.deleteDoubleQuotes) {
        cadena = cadena.trim().replace(/^"/, '').replace(/"$/, '');
      }
      return cadena;
    }

    function _csv2json(csv) {
      const json = {};
      json['type'] = 'FeatureCollection';
      json['features'] = [];
      const titulos = options.titles;
      csv = csv.split(options.lineSeparator);
      for (let num_linea = 0; num_linea < csv.length; num_linea++) {
        const campos = csv[num_linea].trim().split(options.fieldSeparator),
          lng = parseFloat(campos[titulos.indexOf(options.longitudeTitle)]),
          lat = parseFloat(campos[titulos.indexOf(options.latitudeTitle)]);

        const isInRange = lng < 180 && lng > -180 && lat < 90 && lat > -90;
        if (!(campos.length === titulos.length && isInRange)) {
          continue;
        }

        const feature = {};
        feature['type'] = 'Feature';
        feature['geometry'] = {};
        feature['properties'] = {};
        feature['geometry']['type'] = 'Point';
        feature['geometry']['coordinates'] = [lng, lat];
        for (let i = 0; i < titulos.length; i++) {
          if (titulos[i] !== options.latitudeTitle && titulos[i] !== options.longitudeTitle) {
            feature['properties'][_propertiesNames[i]] = _deleteDoubleQuotes(campos[i]);
          }
        }
        json['features'].push(feature);
      }
      return json;
    }
  }

  /**
   * @function ol.supermap.Util.createCanvasContext2D
   * @description 创建 2D 画布。
   * @param {number} opt_width - 画布宽度。
   * @param {number} opt_height - 画布高度。
   */
  static createCanvasContext2D(opt_width, opt_height) {
    const canvas = document.createElement('CANVAS');
    if (opt_width) {
      canvas.width = opt_width;
    }
    if (opt_height) {
      canvas.height = opt_height;
    }
    return canvas.getContext('2d');
  }
  /**
   * @function ol.supermap.Util.supportWebGL2
   * @description 是否支持 webgl2。
   */
  static supportWebGL2() {
    const canvas = document.createElement('canvas');
    return Boolean(canvas && canvas.getContext('webgl2'));
  }

  /**
   * @function ol.supermap.Util.isString
   * @description 是否为字符串
   * @param {string} str - 需要判断的内容
   * @returns {boolean}
   */
  static isString(str) {
    return typeof str === 'string' && str.constructor === String;
  }
  /**
   * @function ol.supermap.Util.isObject
   * @description 是否为对象
   * @param {any} obj - 需要判断的内容
   * @returns {boolean}
   */
  static isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  /**
   * @function ol.supermap.Util.trim
   * @description 字符串裁剪两边的空格
   * @param {string} str - 需要裁剪的字符串
   * @returns {boolean}
   */
  static trim(str = '') {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }
  /**
   * @function ol.supermap.Util.newGuid
   * @description 随机生成id
   * @param {string} attr - 几位数字的id
   * @returns {string}
   */
  static newGuid(attr) {
    let len = attr || 32;
    let guid = '';
    for (let i = 1; i < len; i++) {
      let n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
    }
    return guid;
  }
  /**
   * @function ol.supermap.Util.isNumber
   * @description 检测数据是否为number
   * @param {string} value - 值，未知数据类型
   * @returns {boolean}
   */
  static isNumber(value) {
    if (value === '') {
      return false;
    }
    let mdata = Number(value);
    if (mdata === 0) {
      return true;
    }
    return !isNaN(mdata);
  }
  /**
   * @function ol.supermap.Util.getFeatureBySQL
   * @description 获取feature
   * @param {string} url - 获取feature的请求地址
   * @param {string} datasetNames - 数据集名称
   * @param {object} serviceOptions - 服务类需要的参数
   * @param {function} processCompleted - 成功请求的回调函数
   * @param {function} processFaild - 失败请求的回调函数
   * @param {string | number} targetEpsgCode - 动态投影的目标坐标系对应的 EPSG Code
   */
  static getFeatureBySQL(url, datasetNames, serviceOptions, processCompleted, processFaild, targetEpsgCode) {
    this.getFeatureBySQLWithConcurrent(
      url,
      datasetNames,
      processCompleted,
      processFaild,
      serviceOptions,
      targetEpsgCode
    );
  }

  static getFeatureBySQLWithConcurrent(
    url,
    datasetNames,
    processCompleted,
    processFailed,
    serviceOptions,
    targetEpsgCode
  ) {
    let me = this;
    let queryParameter = new FilterParameter({
      name: datasetNames.join().replace(':', '@')
    });

    let maxFeatures = 100, // 每次请求数据量
      firstResult, // 存储每次请求的结果
      allRequest = []; // 存储发出的请求Promise

    // 发送请求获取获取总数据量
    this._getReasult(url, queryParameter, datasetNames, 0, 1, 1, serviceOptions, targetEpsgCode)
      .then((result) => {
        firstResult = result;
        let totalCount = result.result.totalCount;

        if (totalCount > 1) {
          // 开始并发请求
          for (let i = 1; i < totalCount; ) {
            allRequest.push(
              me._getReasult(
                url,
                queryParameter,
                datasetNames,
                i,
                i + maxFeatures,
                maxFeatures,
                serviceOptions,
                targetEpsgCode
              )
            );
            i += maxFeatures;
          }
          // 所有请求结束
          Promise.all(allRequest)
            .then((results) => {
              // 结果合并
              results.forEach((result) => {
                if (result.type === 'processCompleted' && result.result.features && result.result.features.features) {
                  result.result.features.features.forEach((feature) => {
                    firstResult.result.features.features.push(feature);
                  });
                } else {
                  // todo 提示 部分数据请求失败
                  firstResult.someRequestFailed = true;
                }
              });
              processCompleted(firstResult);
            })
            .catch((error) => {
              processFailed(error);
            });
        } else {
          processCompleted(result);
        }
      })
      .catch((error) => {
        processFailed(error);
      });
  }

  static _getReasult(
    url,
    queryParameter,
    datasetNames,
    fromIndex,
    toIndex,
    maxFeatures,
    serviceOptions,
    targetEpsgCode
  ) {
    return new Promise((resolve, reject) => {
      new FeatureService(url, serviceOptions).getFeaturesBySQL(
        this._getFeaturesBySQLParameters(queryParameter, datasetNames, fromIndex, toIndex, maxFeatures, targetEpsgCode),
        (result) => {
          let featuresResult = result.result;
          //[bug] wt任务编号: 5223
          if (result.type === 'processCompleted' && featuresResult && featuresResult.features) {
            resolve(result);
          } else {
            reject(result);
          }
        }
      );
    });
  }

  static _getFeaturesBySQLParameters(queryParameter, datasetNames, fromIndex, toIndex, maxFeatures, targetEpsgCode) {
    return new GetFeaturesBySQLParameters({
      queryParameter,
      datasetNames,
      fromIndex,
      toIndex,
      maxFeatures,
      returnContent: true,
      targetEpsgCode
    });
  }
  
  static queryFeatureBySQL(
    url,
    layerName,
    attributeFilter,
    fields,
    epsgCode,
    processCompleted,
    processFaild,
    startRecord,
    recordLength,
    onlyAttribute
  ) {
    const queryParam = new FilterParameter({
      name: layerName,
      attributeFilter: attributeFilter
    });
    if (fields) {
      queryParam.fields = fields;
    }
    const params = {
      queryParams: [queryParam]
    };
    if (onlyAttribute) {
      params.queryOption = QueryOption.ATTRIBUTE;
    }
    startRecord && (params.startRecord = startRecord);
    recordLength && (params.expectCount = recordLength);
    if (epsgCode) {
      params.prjCoordSys = {
        epsgCode: epsgCode
      };
    }
    const queryBySQLParams = new QueryBySQLParameters(params);
    const queryBySQLService = new QueryService(url);
    queryBySQLService.queryBySQL(queryBySQLParams, function (data) {
      data.type === 'processCompleted' ? processCompleted(data) : processFaild(data);
    });
  }

  /**
   * @function ol.supermap.Util.getFeatureProperties
   * @description 从feature中获取properties
   * @param {array} features 要素数组
   * @returns {array} 属性
   */
  static getFeatureProperties(features) {
    let properties = [];
    if (Util.isArray(features) && features.length) {
      features.forEach((feature) => {
        let property = feature.get('attributes');
        property && properties.push(property);
      });
    }
    return properties;
  }

  /**
   * @function ol.supermap.Util.isMatchAdministrativeName
   * @param {string} featureName 原始数据中的地名
   * @param {string} fieldName 需要匹配的地名
   * @returns {boolean} 是否匹配
   */
  static isMatchAdministrativeName(featureName, fieldName) {
    if (Util.isString(fieldName)) {
      let shortName = featureName.substr(0, 2);
      // 张家口市和张家界市 特殊处理
      if (shortName === '张家') {
        shortName = featureName.substr(0, 3);
      }
      return !!fieldName.match(new RegExp(shortName));
    }
    return false;
  }

  /**
   * @function ol.supermap.Util.getHighestMatchAdministration
   * @param {string} featureName 初始匹配的要素数组
   * @param {string} fieldName 要匹配的地名
   * @returns {boolean} 是否匹配
   */
  static getHighestMatchAdministration(features, fieldName) {
    let filterFeatures = features.filter((item) => {
      return Util.isMatchAdministrativeName(item.properties.Name, fieldName);
    });

    let maxMatchPercent = 0,
      maxMatchFeature = null;
    filterFeatures.forEach((feature) => {
      let count = 0;
      Array.from(new Set(feature.properties.Name.split(''))).forEach((char) => {
        if (fieldName.includes(char)) {
          count++;
        }
      });
      if (count > maxMatchPercent) {
        maxMatchPercent = count;
        maxMatchFeature = feature;
      }
    });
    return maxMatchFeature;
  }

  /**
   * @function ol.supermap.Util.setMask
   * @description 为图层设置掩膜。
   * @version 10.1.0
   * @param {ol/layer/Layer|Array.<ol/layer/Layer>} layers 图层
   * @param {ol/geom/Geometry|ol/feature} polygon 掩膜矢量要素，支持面类型的要素。
   */
  static setMask(layers, polygon) {
    if (!polygon) {
      return;
    }
    const geo = polygon instanceof Feature ? polygon.getGeometry() : polygon;
    if (!(geo instanceof Geometry) && ['MultiPolygon', 'Polygon'].indexOf(polygon.getType()) < 0) {
      return;
    }
    const feature = polygon instanceof Feature ? polygon : new Feature(polygon);
    const style = new Style({
      fill: new Fill({
        color: 'black'
      })
    });

    const clipLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature],
        wrapX: false
      })
    });

    const clipRender = function (e) {
      const vectorContext = getVectorContext(e);
      e.context.globalCompositeOperation = 'destination-in';
      clipLayer.getSource().forEachFeature(function (feature) {
        vectorContext.drawFeature(feature, style);
        e.context.globalCompositeOperation = 'source-over';
      });
    };
    const todoLayers = Array.isArray(layers) ? layers : [layers];
    Util.unsetMask(todoLayers);
    todoLayers.forEach((layer) => {
      layer.classNameBak_ = layer.className_;
      layer.className_ = `ol_mask_layer_${layer.ol_uid}`;
      layer.clipRender = clipRender;
      layer.extentBak_ = layer.getExtent();
      layer.setExtent(clipLayer.getSource().getExtent());
      layer.on('postrender', clipRender);
      layer.changed();
    });
  }
  /**
   * @function ol.supermap.Util.unsetMask
   * @description 取消图层掩膜。
   * @version 10.1.0
   * @param {ol/layer/Layer|Array.<ol/layer/Layer>} layers 图层
   */
  static unsetMask(layers) {
    const todoLayers = Array.isArray(layers) ? layers : [layers];
    for (let index = 0; index < todoLayers.length; index++) {
      const layer = todoLayers[index];
      if (!layer.clipRender) {
        continue;
      }
      layer.un('postrender', layer.clipRender);
      layer.className_ = layer.classNameBak_;
      layer.setExtent(layer.extentBak);
      delete layer.classNameBak_;
      delete layer.clipRender;
      delete layer.extentBak_;
      layer.changed();
    }
  }
}
