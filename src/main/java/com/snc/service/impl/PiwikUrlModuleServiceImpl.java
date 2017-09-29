package com.snc.service.impl;

import com.snc.dao.PiwikUrlModuleDao;
import com.snc.service.PiwikUrlModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * Created by taotaosun on 2017/9/29.
 */
@Service("piwikUrlModuleServiceImpl")
@Transactional(readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class PiwikUrlModuleServiceImpl implements PiwikUrlModuleService {
    @Autowired
    PiwikUrlModuleDao piwikUrlModuleDao;

    @Override
    public void refreshPiwikUrlModule() {
        piwikUrlModuleDao.deleteAll();
        piwikUrlModuleDao.insertUrlModule();
    }

    @Override
    public List<String> selectModuleByUrl(String url) {
        return piwikUrlModuleDao.selectModuleByUrl(url);
    }

    @Override
    public List<String> selectUrlByModule(String module) {
        return piwikUrlModuleDao.selectUrlByModule(module);
    }


}
