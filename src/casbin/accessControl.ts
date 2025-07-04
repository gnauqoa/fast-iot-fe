import { newModel, StringAdapter } from 'casbin';

export const model = newModel(`
  [request_definition]
  r = sub, obj, act

  [policy_definition]
  p = sub, obj, act

  [role_definition]
  g = _, _

  [policy_effect]
  e = some(where (p.eft == allow))

  [matchers]
  m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`);

export const adapter = new StringAdapter(`
p, 1, users, (list)|(create)|(edit)|(show)|(delete)
p, 1, devices, (list)|(create)|(edit)|(show)|(delete)
p, 1, notifications, (list)|(create)|(edit)|(show)|(delete)
p, 1, devices-map, (list)|(create)|(edit)|(show)|(delete)
p, 1, templates, (list)|(create)|(edit)|(show)|(delete)
p, 1, profile, (list)
p, 1, statuses, (list)|(create)|(edit)|(show)|(delete)

p, 2, devices, (list)|(create)|(edit)|(show)|(delete)
p, 2, notifications, (list)|(create)|(edit)|(show)|(delete)
p, 2, profile, (list)
p, 2, devices-map, (list)|(create)|(edit)|(show)|(delete)
p, 2, templates, (list)|(create)|(edit)|(show)|(delete)
`);
