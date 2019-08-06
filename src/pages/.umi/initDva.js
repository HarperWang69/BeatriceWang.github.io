import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'dynamicmenu', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/models/dynamicmenu.js').default) });
app.model({ namespace: 'global', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/models/menu.js').default) });
app.model({ namespace: 'option', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/models/option.js').default) });
app.model({ namespace: 'project', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/models/user.js').default) });
app.model({ namespace: 'register', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/pages/User/models/register.js').default) });
app.model({ namespace: 'user', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/pages/Account/models/user.js').default) });
app.model({ namespace: 'grid', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/pages/Grid/models/grid.js').default) });
app.model({ namespace: 'event', ...(require('C:/Users/admin/Desktop/SVN/TBH/src/pages/Event/models/event.js').default) });
