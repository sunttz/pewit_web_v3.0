package com.snc.service.impl;

import com.snc.dao.PiwikLogActionDao;
import com.snc.entity.PiwikLogAction;
import com.snc.service.PiwikLogActionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
