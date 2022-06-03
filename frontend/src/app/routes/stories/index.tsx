import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { BlogItem } from '~/core/components/blog-item';
import { getStoreFront } from '~/core/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }: { data: any }) => {
    let metaData = data?.folder?.meta?.content?.chunks?.[0];

    return {
        title: `${metaData?.[0]?.content?.text}`,
        description: `${metaData?.[1]?.content?.plainText}`,
        'og:image': `${metaData?.[2]?.content?.firstImage?.url}`,
    };
};

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = `/stories`;
    const { shared, secret } = await getStoreFront(request.headers.get('Host')!);
    const folder = await CrystallizeAPI.fetchFolder(secret.apiClient, path, version);
    return json({ folder }, StoreFrontAwaretHttpCacheHeaderTagger('30s', '30s', [path], shared.config));
};

export default function FolderPage() {
    const { folder } = useLoaderData();
    let title = folder.components.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = folder.components.find((component: any) => component.type === 'richText')?.content?.plainText;

    return (
        <div className="container 2xl px-6 mx-auto w-full">
            <h1 className="text-3xl font-bold mt-10 mb-4">{title}</h1>
            <div className="flex gap-5">{description}</div>
            <div className="grid grid-cols-3 gap-6 mt-10">
                {folder.children.map((child: any) => (
                    <BlogItem item={child} key={child.name} />
                ))}
            </div>
        </div>
    );
}
