import { ContentTransformer, Image } from '@crystallize/reactjs-components';
import { CuratedProduct } from '~/core/components/curated-product';
import { useState } from 'react';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { AddToCartBtn } from '~/core/components/add-to-cart-button';

const getComponentContent = (components: any, id: string) => {
    let component = components.find((component: any) => component.id === id);
    return component?.content || null;
};

export function CuratedProductStory({ document }: { document: any }) {
    const [activePoint, setActivePoint] = useState('');
    let [variants, setVariants] = useState([]);

    const { add } = useLocalCart();
    let title = getComponentContent(document?.components, 'title')?.text;
    let description = getComponentContent(document?.components, 'description')?.json;
    let shoppableImage = getComponentContent(document?.components, 'shoppable-image')?.images?.[0];
    let merchandising = getComponentContent(document?.components, 'merchandising')?.chunks?.map((merch: any) => {
        return {
            products: getComponentContent(merch, 'products')?.items,
            hotspotX: getComponentContent(merch, 'hotspot-point-x'),
            hotspotY: getComponentContent(merch, 'hotspot-point-y'),
        };
    });

    let totalAmountToPay = 0;
    variants.map((v: any) => {
        const price = v.priceVariants.find((price: any) => price.identifier === 'sales')?.price || v.price;
        totalAmountToPay += price;
    });

    return (
        <div className="2xl grid grid-cols-2 gap-8 min-h-full container px-6 mx-auto mt-20 mb-40">
            {/* {showCart ? <Cart /> : null} */}

            <div className="img-container overflow-hidden self-start rounded-lg relative">
                <div className="absolute h-full w-full frntr-hotspot">
                    {merchandising.map((merch: any, i: number) => (
                        <span
                            onMouseOver={() => setActivePoint(`hotspot-point-${i}`)}
                            onMouseLeave={() => setActivePoint('')}
                            key={`hotspot-${merch.hotspotX.number}-${merch.hotspotY.number}`}
                            style={{ left: merch.hotspotX.number + `%`, top: merch.hotspotY.number + '%' }}
                        />
                    ))}
                </div>
                <Image {...shoppableImage} sizes="50vw" />
            </div>
            <div className="px-6">
                <h1 className="text-4xl font-semibold mb-2">{title}</h1>
                <div className="w-3/4 text-2xl leading-[1.8em]">
                    <ContentTransformer json={description} />
                </div>
                <div>
                    {merchandising.map((merch: any, i: number) => (
                        <div
                            key={`merch-container-${merch.hotspotX.number}-${merch.hotspotY.number}`}
                            className="px-2 bg-grey overflow-hidden rounded-md my-2"
                            style={{
                                border:
                                    activePoint === `hotspot-point-${i}` ? '1px solid #000' : '1px solid transparent',
                            }}
                        >
                            <CuratedProduct merch={merch} current={{ variants, setVariants }} />
                        </div>
                    ))}
                </div>
                <div className="flex pt-5 mt-5 border-solid border-t-[1px] border-[#dfdfdf] items-center justify-between">
                    <div className="text-4xl font-bold text-green2">€{totalAmountToPay}</div>
                    <AddToCartBtn products={variants} label={`Add ${variants?.length} to cart`} />
                </div>
            </div>
        </div>
    );
}
