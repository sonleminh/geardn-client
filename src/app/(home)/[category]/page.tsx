'use client';

import { useGetProductsByCategory } from '@/apis/product';
import Heading from '@/components/common/heading';
import ProductCard from '@/components/common/ProductCard';
import { Box, Grid2 } from '@mui/material';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const { data } = useGetProductsByCategory(category);
  console.log('data', data);
  return (
    <Box sx={{ py: 4, bgcolor: '#F3F4F6' }}>
      <Heading total={data?.total ?? 0} params={data?.total ?? 0} />
      <Grid2 container spacing={2}>
        {data?.data?.map((item) => (
          <Grid2 size={3} key={item.id}>
            <ProductCard data={item} />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}

// export default async function ProductDetailPage({
//   params,
// }: {
//   params: Promise<{ category: string }>;
// }) {
//   const { category } = await params;
// const productData = await getProductBySlug(category);
// const params = useParams();
// const router = useRouter();
// const { showNotification } = useNotificationStore();

// const mainSwiperRef = useRef<SwiperClass | null>(null);

// const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
// const [count, setCount] = useState<number | null>(1);

// const [optionImage, setOptionImage] = useState<string>('');
// const [matchedModel, setMatchedModel] = useState<IModel | null>(null);
// const [addCartError, setAddCartError] = useState<boolean>(false);
// const [addQuantityError, setAddQuantityError] = useState<boolean>(false);
// const [isOutOfStock, setIsOutOfStock] = useState<boolean>(false);

// const productData = await useGetProductBySlug(params?.slug as string);
// // const userData = await addCartItemAPI(values);

// const addToCart = useCartStore((state) => state.addToCart);

// const breadcrumbsOptions = [
//   { href: '/', label: 'Home' },
//   { href: `/product/${product?.id}`, label: product?.name as string },
// ];

// const attributeOptions = useMemo(() => {
//   const options: Record<string, string[]> = {};
//   productData?.skus?.forEach((sku) => {
//     sku?.productSkuAttributes?.forEach(({ attribute }) => {
//       if (!options[attribute.type]) {
//         options[attribute.type] = [];
//       }
//       if (!options[attribute.type].includes(attribute.value)) {
//         options[attribute.type].push(attribute.value);
//       }
//     });
//   });
//   return options;
// }, [product?.skus]);

// const [selectedAttributes, setSelectedAttributes] = useState<
//   Record<string, string>
// >({});

// const availableCombinations = product?.skus?.map((sku) =>
//   sku.productSkuAttributes.reduce((acc, attr) => {
//     acc[attr.attribute.type] = attr.attribute.value;
//     return acc;
//   }, {} as Record<string, string>)
// );

// const handleDisableAttribute = useMemo(() => {
//   return (type: string, value: string) => {
//     if (Object.keys(selectedAttributes).length === 0) return false;
//     // Tạo bản sao tránh mutate state gốc
//     const simulatedSelection = { ...selectedAttributes };

//     // Nếu đã chọn, loại bỏ thuộc tính khỏi danh sách chọn
//     if (simulatedSelection[type] === value) {
//       delete simulatedSelection[type]; // Xóa hẳn key
//     } else {
//       simulatedSelection[type] = value; // Chọn mới
//     }

//     const filteredSelection = Object.fromEntries(
//       Object.entries(simulatedSelection).filter(([_, val]) => val)
//     );

//     // Nếu không còn gì trong selectedAttributes, không disable gì cả
//     if (Object.keys(filteredSelection).length === 0) return false;

//     // Kiểm tra nếu tổ hợp mới này có hợp lệ
//     const isValid = availableCombinations.some((combo) =>
//       Object.entries(filteredSelection).every(
//         ([key, val]) => combo[key] === val
//       )
//     );

//     return !isValid;
//   };
// }, [selectedAttributes]);

// const handleCountChange = (value: number | null) => {
//   if (value && value >= 0) {
//     setCount(value);
//   }
// };

// const selectedSku = useMemo<ISku | null>(() => {
//   const hasNullValue = Object.values(selectedAttributes).some(
//     (value) => value === null
//   );

//   if (
//     hasNullValue ||
//     Object.keys(selectedAttributes).length !==
//       Object.keys(attributeOptions).length
//   )
//     return null;

//   return (
//     product?.skus?.find((sku) =>
//       Object.entries(selectedAttributes).every(([key, value]) =>
//         sku.productSkuAttributes.some(
//           (attr) =>
//             attr.attribute.type === key && attr.attribute.value === value
//         )
//       )
//     ) ?? null
//   );
// }, [selectedAttributes, product?.skus]);
// console.log('selectedSku', selectedSku);
// const getLowestPrice = () => {
//   if (!product?.skus || product?.skus.length === 0) return null;

//   return Math.min(...product?.skus.map((sku) => Number(sku.price)));
// };

// const handleAttributeChange = (type: string, value: string) => {
//   setSelectedAttributes((prev) => {
//     const newAttributes = { ...prev };

//     if (newAttributes[type] === value) {
//       delete newAttributes[type]; // Nếu đã chọn, thì bỏ chọn
//     } else {
//       newAttributes[type] = value; // Nếu chưa chọn, thì chọn
//     }

//     return newAttributes;
//   });
// };

// const productImageList = useMemo(() => {
//   return [
//     ...(product?.data?.images || []),
//     ...(product?.data?.skus.map((sku) => sku.imageUrl) || []),
//   ];
// }, [product?.data?.images, product?.data?.skus]);

// const handleAddCartItem = async () => {
//   if (selectedSku === null) {
//     return showNotification('Vui lý chọn sản phẩm', 'error');
//   }

//   // await addCartItemAPI({
//   //   productId: selectedSku?.productId,
//   //   skuId: selectedSku?.id,
//   //   quantity: count ?? 1,
//   // });

//   // const existingCart = JSON.parse(localStorage.getItem('cart') ?? '[]');

//   // const modelInCart = cart?.items?.find(
//   //   (item) => item.modelid === matchedModel?.id
//   // );

//   // if (
//   //   modelInCart &&
//   //   (count ?? 1) + modelInCart?.quantity > matchedModel?.stock
//   // ) {
//   //   return setAddQuantityError(true);
//   // }
//   // try {
//   //   await addCartAPI({
//   //     userid: user?.id ? user?.id : null,
//   //     model:
//   //       product?.tier_variations?.length === 0
//   //         ? product?.models[0]?.id ?? ''
//   //         : matchedModel?.id ?? '',
//   //     quantity: count ?? 1,
//   //   });
//   //   mutate('/cart');
//   //   globalMutate(`/cart`, undefined, { revalidate: true });
//   //   showNotification('Sản phẩm đã dược thêm vào giỏ hàng!', 'success');
//   //   setAddQuantityError(false);
//   // } catch (error: any) {
//   //   showNotification(error?.message, 'error');
//   // }
// };

// useEffect(() => {
//   if (selectedSku && mainSwiperRef.current) {
//     const imageIndex = productImageList.findIndex(
//       (img) => img === selectedSku.imageUrl
//     );

//     if (imageIndex !== -1) {
//       mainSwiperRef.current.slideTo(imageIndex);
//     }
//   }
// }, [selectedSku, productImageList]);

// const totalStock = product?.skus?.reduce(
//   (acc, sku) => acc + (sku.quantity || 0),
//   0
// );

// return <ProductMain product={productData} />;
//   return <></>;
// }
