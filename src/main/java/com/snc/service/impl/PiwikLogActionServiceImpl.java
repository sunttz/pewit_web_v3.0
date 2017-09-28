package com.snc.service.impl;

import com.snc.dao.PiwikLogActionDao;
import com.snc.entity.PiwikLogAction;
import com.snc.service.PiwikLogActionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by taotaosun on 2017/9/21.
 */
@Service("piwikLogActionServiceImpl")
public class PiwikLogActionServiceImpl implements PiwikLogActionService {

    @Autowired
    PiwikLogActionDao piwikLogActionDao;

    @Override
    public PiwikLogAction selectByPrimaryKey(Integer idaction) {
        return piwikLogActionDao.selectByPrimaryKey(idaction);
    }

    @Override
    public int updateByPrimaryKeySelective(PiwikLogAction record) {
        return piwikLogActionDao.updateByPrimaryKeySelective(record);
    }

    @Override
    public List<Map<String, Object>> selectSiteModules(Integer idsite) {
        return piwikLogActionDao.selectSiteModules(idsite);
    }

    @Override
    public List<Map<String, Object>> selectNamesByType(Integer type) {
        List<String> names = piwikLogActionDao.selectNamesByType(type);
        List<Map<String, Object>> modules = new ArrayList<>();
        Map<String,Object> row = null;
        for(String name : names){
            row = new HashMap<>();
            // url前补充http://头
            if(type == 1){
                name = "http://" + name;
            }
            row.put("val",name);
            row.put("label",subStringByByte(name,50));
            modules.add(row);
        }
        return modules;
    }

    /**
     * 按字节截取字符串
     *
     * @param o
     * @param len
     * @return
     */
    private static String subStringByByte(Object o, int len) {
        if (o == null) {
            return "";
        }
        String str = o.toString();
        String result = null;
        if (str != null) {
            byte[] a = str.getBytes();
            if (a.length <= len) {
                result = str;
            } else if (len > 0) {
                result = new String(a, 0, len);
                int length = result.length();
                if (str.charAt(length - 1) != result.charAt(length - 1)) {
                    if (length < 2) {
                        result = null;
                    } else {
                        result = result.substring(0, length - 1);
                    }
                }
                result += "...";
            }
        }
        return result;
    }

}
