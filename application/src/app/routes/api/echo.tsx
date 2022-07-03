import { ActionFunction, json } from '@remix-run/node';
import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const action: ActionFunction = async ({ request }) => {
    const { secret: storefront } = await getStoreFront(getHost(request));
    return json({
        echoed: await request.json(),
        tenant: storefront.config.tenantIdentifier,
    });
};
