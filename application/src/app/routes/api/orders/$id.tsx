import { createOrderFetcher } from '@crystallize/js-api-client';
import { handleOrderRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { json, LoaderFunction } from '@remix-run/node';
import { authenticate } from '~/core-server/authentication.server';
import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const loader: LoaderFunction = async ({ request, params }) => {
    const { secret: storefront } = await getStoreFront(getHost(request));
    const auth: any = await authenticate(request);
    return json(
        await handleOrderRequestPayload(null, {
            fetcherById: createOrderFetcher(storefront.apiClient).byId,
            user: auth.user.aud,
            orderId: params.id!,
        }),
    );
};
