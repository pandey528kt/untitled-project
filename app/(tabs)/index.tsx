import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Home,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingCart,
  ShieldCheck,
  Truck,
  WalletCards,
  X,
} from 'lucide-react-native';

type Product = {
  id: string;
  name: string;
  detail: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
};

type CartItem = Product & { quantity: number };

const products: Product[] = [
  { id: 'atta', name: 'Aashirvaad Atta', detail: '5 kg pack', price: 285, oldPrice: 320, category: 'Staples', image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'oil', name: 'Fortune Sunflower Oil', detail: '1 litre pouch', price: 142, category: 'Staples', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'dal', name: 'Toor Dal', detail: '1 kg premium', price: 165, oldPrice: 185, category: 'Staples', image: 'https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'milk', name: 'Amul Taaza Milk', detail: '1 litre', price: 62, category: 'Dairy', image: 'https://images.pexels.com/photos/5946720/pexels-photo-5946720.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'bread', name: 'Harvest Bread', detail: '400 g loaf', price: 45, category: 'Breakfast', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'tea', name: 'Red Label Tea', detail: '250 g pack', price: 125, category: 'Beverages', image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'chips', name: 'Lays Magic Masala', detail: '52 g pack', price: 20, category: 'Snacks', image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'soap', name: 'Dove Cream Beauty Bar', detail: '100 g', price: 58, category: 'Care', image: 'https://images.pexels.com/photos/4210371/pexels-photo-4210371.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

const categories = ['All', 'Staples', 'Dairy', 'Breakfast', 'Beverages', 'Snacks', 'Care'];
const money = (value: number) => `Rs ${value.toLocaleString('en-IN')}`;

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState({ name: '', phone: '', line: '', city: '' });
  const [payment, setPayment] = useState('Cash on delivery');
  const [formError, setFormError] = useState('');

  const filteredProducts = useMemo(() => products.filter((product) =>
    (category === 'All' || product.category === category) &&
    `${product.name} ${product.detail}`.toLowerCase().includes(query.toLowerCase()),
  ), [category, query]);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal >= 399 || subtotal === 0 ? 0 : 25;
  const total = subtotal + delivery;
  const columns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  const updateCart = (product: Product, delta: number) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (!existing && delta > 0) return [...current, { ...product, quantity: 1 }];
      return current
        .map((item) => item.id === product.id ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0);
    });
  };

  const placeOrder = () => {
    if (!address.name || !address.phone || !address.line || !address.city) {
      setFormError('Please complete every address field to continue.');
      return;
    }
    setFormError('');
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCheckoutOpen(false);
      setCartOpen(false);
      setCart([]);
      setOrdered(true);
    }, 900);
  };

  if (ordered) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successScreen}>
          <View style={styles.successIcon}><PackageCheck color={COLORS.ink} size={42} strokeWidth={1.8} /></View>
          <Text style={styles.successKicker}>ORDER CONFIRMED</Text>
          <Text style={styles.successTitle}>Your kirana is on the way.</Text>
          <Text style={styles.successCopy}>We will deliver your essentials to {address.line || 'your address'} in about 25-35 minutes.</Text>
          <View style={styles.orderCard}>
            <View><Text style={styles.orderLabel}>ORDER TOTAL</Text><Text style={styles.orderTotal}>{money(total)}</Text></View>
            <View style={styles.orderStatus}><CheckCircle2 color={COLORS.green} size={18} /><Text style={styles.statusText}>Preparing</Text></View>
          </View>
          <Pressable style={styles.primaryButton} onPress={() => setOrdered(false)}><Text style={styles.primaryButtonText}>Continue shopping</Text><ChevronRight color={COLORS.cream} size={18} /></Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <View><Text style={styles.brand}>anil <Text style={styles.brandItalic}>Kirana</Text></Text><Text style={styles.brandSub}>STORE</Text></View>
          <Pressable style={styles.cartButton} onPress={() => setCartOpen(true)} accessibilityLabel="Open cart">
            <ShoppingCart color={COLORS.ink} size={21} /><View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{itemCount}</Text></View>
          </Pressable>
        </View>
        <View style={styles.locationRow}><MapPin color={COLORS.orange} size={16} fill={COLORS.orange} /><Text style={styles.locationText}>Delivering near <Text style={styles.locationStrong}>Andheri East</Text></Text><ChevronRight color={COLORS.muted} size={15} /></View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}><Text style={styles.eyebrow}>FRESH FROM OUR SHELVES</Text><Text style={styles.heroTitle}>Everyday essentials,{`\n`}right at your door.</Text><Text style={styles.heroBody}>Your trusted neighbourhood store, now just a few taps away.</Text><View style={styles.deliveryNote}><Clock3 color={COLORS.cream} size={16} /><Text style={styles.deliveryNoteText}>Fast delivery in 25-35 min</Text></View></View>
          <View style={styles.heroSun}><Text style={styles.heroSunText}>Rs</Text></View>
        </View>

        <View style={styles.searchBox}><Search color={COLORS.muted} size={20} /><TextInput value={query} onChangeText={setQuery} placeholder="Search rice, milk, snacks..." placeholderTextColor={COLORS.muted} style={styles.searchInput} /></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>{categories.map((item) => <Pressable key={item} style={[styles.category, item === category && styles.categoryActive]} onPress={() => setCategory(item)}><Text style={[styles.categoryText, item === category && styles.categoryTextActive]}>{item}</Text></Pressable>)}</ScrollView>

        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Shop the essentials</Text><Text style={styles.sectionSub}>{filteredProducts.length} items available today</Text></View><View style={styles.verified}><ShieldCheck color={COLORS.green} size={15} /><Text style={styles.verifiedText}>Quality checked</Text></View></View>
        {filteredProducts.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>No items found</Text><Text style={styles.emptyCopy}>Try a different search or category.</Text></View> : <View style={styles.grid}>{filteredProducts.map((product) => {
          const quantity = cart.find((item) => item.id === product.id)?.quantity || 0;
          return <View style={[styles.productCard, { width: `${100 / columns - 2}%` }]} key={product.id}><View style={styles.productImageWrap}><Image source={{ uri: product.image }} style={styles.productImage} /><Text style={styles.productCategory}>{product.category}</Text></View><Text style={styles.productName} numberOfLines={2}>{product.name}</Text><Text style={styles.productDetail}>{product.detail}</Text><View style={styles.productBottom}><View><Text style={styles.price}>{money(product.price)}</Text>{product.oldPrice && <Text style={styles.oldPrice}>{money(product.oldPrice)}</Text>}</View>{quantity === 0 ? <Pressable style={styles.addButton} onPress={() => updateCart(product, 1)}><Plus color={COLORS.cream} size={17} /><Text style={styles.addText}>Add</Text></Pressable> : <View style={styles.stepper}><Pressable onPress={() => updateCart(product, -1)} accessibilityLabel={`Remove one ${product.name}`}><Minus color={COLORS.ink} size={15} /></Pressable><Text style={styles.quantity}>{quantity}</Text><Pressable onPress={() => updateCart(product, 1)} accessibilityLabel={`Add one ${product.name}`}><Plus color={COLORS.ink} size={15} /></Pressable></View>}</View></View>;
        })}</View>}

        <View style={styles.trustRow}><View style={styles.trustItem}><Truck color={COLORS.orange} size={20} /><Text style={styles.trustTitle}>Quick delivery</Text><Text style={styles.trustCopy}>To your doorstep</Text></View><View style={styles.trustItem}><ShieldCheck color={COLORS.orange} size={20} /><Text style={styles.trustTitle}>Trusted quality</Text><Text style={styles.trustCopy}>Every item checked</Text></View><View style={styles.trustItem}><WalletCards color={COLORS.orange} size={20} /><Text style={styles.trustTitle}>Easy payment</Text><Text style={styles.trustCopy}>Cash or UPI</Text></View></View>
      </ScrollView>

      {itemCount > 0 && <Pressable style={[styles.floatingCart, { bottom: Math.max(insets.bottom, 14) }]} onPress={() => setCartOpen(true)}><View><Text style={styles.floatingCartTitle}>{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</Text><Text style={styles.floatingCartTotal}>{money(total)}</Text></View><View style={styles.viewCart}><Text style={styles.viewCartText}>View cart</Text><ChevronRight color={COLORS.cream} size={18} /></View></Pressable>}

      <Modal visible={cartOpen} animationType="slide" transparent onRequestClose={() => setCartOpen(false)}><View style={styles.modalBackdrop}><View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 18) }]}><View style={styles.sheetHandle} /><View style={styles.sheetHeader}><View><Text style={styles.sheetTitle}>Your cart</Text><Text style={styles.sheetSub}>{itemCount} items · delivery from Anil Kirana</Text></View><Pressable onPress={() => setCartOpen(false)} accessibilityLabel="Close cart"><X color={COLORS.ink} size={23} /></Pressable></View>{cart.length === 0 ? <View style={styles.cartEmpty}><ShoppingCart color={COLORS.muted} size={34} /><Text style={styles.emptyTitle}>Your cart is empty</Text><Text style={styles.emptyCopy}>Add a few essentials to get started.</Text></View> : <><ScrollView style={styles.cartList}>{cart.map((item) => <View style={styles.cartLine} key={item.id}><Image source={{ uri: item.image }} style={styles.cartImage} /><View style={styles.cartInfo}><Text style={styles.cartName}>{item.name}</Text><Text style={styles.cartDetail}>{item.detail}</Text><Text style={styles.cartPrice}>{money(item.price * item.quantity)}</Text></View><View style={styles.stepper}><Pressable onPress={() => updateCart(item, -1)}><Minus color={COLORS.ink} size={15} /></Pressable><Text style={styles.quantity}>{item.quantity}</Text><Pressable onPress={() => updateCart(item, 1)}><Plus color={COLORS.ink} size={15} /></Pressable></View></View>)}</ScrollView><View style={styles.summary}><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>{money(subtotal)}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery fee</Text><Text style={styles.summaryValue}>{delivery ? money(delivery) : 'FREE'}</Text></View><View style={styles.summaryRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{money(total)}</Text></View><Pressable style={styles.primaryButton} onPress={() => setCheckoutOpen(true)}><Text style={styles.primaryButtonText}>Proceed to checkout</Text><ChevronRight color={COLORS.cream} size={18} /></Pressable></View></>}</View></View></Modal>

      <Modal visible={checkoutOpen} animationType="slide" transparent onRequestClose={() => setCheckoutOpen(false)}><KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 18) }]}><View style={styles.sheetHandle} /><View style={styles.sheetHeader}><View style={styles.checkoutTitleRow}><Pressable onPress={() => setCheckoutOpen(false)}><ArrowLeft color={COLORS.ink} size={22} /></Pressable><Text style={styles.sheetTitle}>Delivery details</Text></View><Pressable onPress={() => setCheckoutOpen(false)}><X color={COLORS.ink} size={23} /></Pressable></View><ScrollView showsVerticalScrollIndicator={false}><Text style={styles.formIntro}>Where should we bring your order?</Text><View style={styles.formRow}><View style={styles.fieldHalf}><Text style={styles.fieldLabel}>Your name</Text><TextInput style={styles.field} placeholder="Anil Kumar" value={address.name} onChangeText={(value) => setAddress({ ...address, name: value })} placeholderTextColor={COLORS.muted} /></View><View style={styles.fieldHalf}><Text style={styles.fieldLabel}>Phone number</Text><TextInput style={styles.field} placeholder="98765 43210" keyboardType="phone-pad" value={address.phone} onChangeText={(value) => setAddress({ ...address, phone: value })} placeholderTextColor={COLORS.muted} /></View></View><Text style={styles.fieldLabel}>House / flat and street</Text><TextInput style={styles.field} placeholder="Flat 4B, Green View Apartments" value={address.line} onChangeText={(value) => setAddress({ ...address, line: value })} placeholderTextColor={COLORS.muted} /><Text style={styles.fieldLabel}>Area / city</Text><TextInput style={styles.field} placeholder="Andheri East, Mumbai" value={address.city} onChangeText={(value) => setAddress({ ...address, city: value })} placeholderTextColor={COLORS.muted} /><Text style={[styles.formIntro, { marginTop: 18 }]}>Payment method</Text>{['Cash on delivery', 'UPI (dummy)', 'Card (dummy)'].map((method) => <Pressable key={method} style={[styles.paymentOption, payment === method && styles.paymentOptionActive]} onPress={() => setPayment(method)}>{method === 'Cash on delivery' ? <Home color={COLORS.orange} size={20} /> : <CreditCard color={COLORS.orange} size={20} />}<Text style={styles.paymentText}>{method}</Text><View style={[styles.radio, payment === method && styles.radioActive]}>{payment === method && <Check color={COLORS.cream} size={13} />}</View></Pressable>)}{formError ? <Text style={styles.formError}>{formError}</Text> : <Text style={styles.dummyNote}>This is a demo checkout. No real payment will be charged.</Text>}<Pressable style={[styles.primaryButton, processing && styles.buttonDisabled]} onPress={placeOrder} disabled={processing}>{processing ? <><ActivityIndicator color={COLORS.cream} size="small" /><Text style={styles.primaryButtonText}>Placing order...</Text></> : <><Text style={styles.primaryButtonText}>Place order · {money(total)}</Text><CheckCircle2 color={COLORS.cream} size={18} /></>}</Pressable></ScrollView></View></KeyboardAvoidingView></Modal>
    </SafeAreaView>
  );
}

const COLORS = { ink: '#17352b', cream: '#fff9ed', orange: '#dc6331', green: '#3e8a55', paper: '#f7f3e9', muted: '#7d877c', line: '#e5dfd1', yellow: '#f4c95d' };

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper }, page: { paddingHorizontal: 18, paddingBottom: 110, maxWidth: 1180, width: '100%', alignSelf: 'center' }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, paddingBottom: 8 }, brand: { color: COLORS.ink, fontSize: 25, fontWeight: '800', letterSpacing: -1 }, brandItalic: { color: COLORS.orange, fontStyle: 'italic' }, brandSub: { color: COLORS.muted, fontSize: 8, fontWeight: '700', letterSpacing: 3, marginTop: -2 }, cartButton: { width: 45, height: 45, borderRadius: 23, backgroundColor: COLORS.cream, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' }, cartBadge: { position: 'absolute', right: -2, top: -3, backgroundColor: COLORS.orange, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.paper }, cartBadgeText: { color: COLORS.cream, fontSize: 10, fontWeight: '800' }, locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 18 }, locationText: { color: COLORS.muted, fontSize: 13 }, locationStrong: { color: COLORS.ink, fontWeight: '700' }, hero: { minHeight: 230, borderRadius: 22, padding: 23, backgroundColor: COLORS.ink, overflow: 'hidden', flexDirection: 'row', marginBottom: 20 }, heroCopy: { flex: 1, zIndex: 2 }, eyebrow: { color: COLORS.yellow, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 }, heroTitle: { color: COLORS.cream, fontSize: 29, lineHeight: 33, fontWeight: '800', letterSpacing: -0.7 }, heroBody: { color: '#bdd0c1', fontSize: 13, lineHeight: 19, marginTop: 12, maxWidth: 275 }, deliveryNote: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 18 }, deliveryNoteText: { color: COLORS.cream, fontSize: 12, fontWeight: '700' }, heroSun: { width: 145, height: 145, borderRadius: 80, backgroundColor: COLORS.yellow, position: 'absolute', right: -27, bottom: -24, alignItems: 'center', justifyContent: 'center' }, heroSunText: { color: COLORS.orange, fontSize: 92, fontWeight: '800', transform: [{ rotate: '-15deg' }] }, searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.cream, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line, paddingHorizontal: 14, height: 50 }, searchInput: { flex: 1, fontSize: 15, color: COLORS.ink }, categoryRow: { gap: 8, paddingVertical: 16 }, category: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: 20, backgroundColor: '#ebe7dc' }, categoryActive: { backgroundColor: COLORS.ink }, categoryText: { color: COLORS.muted, fontSize: 13, fontWeight: '700' }, categoryTextActive: { color: COLORS.cream }, sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 13, marginTop: 4 }, sectionTitle: { color: COLORS.ink, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 }, sectionSub: { color: COLORS.muted, fontSize: 12, marginTop: 3 }, verified: { flexDirection: 'row', alignItems: 'center', gap: 4 }, verifiedText: { color: COLORS.green, fontSize: 11, fontWeight: '700' }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }, productCard: { backgroundColor: COLORS.cream, borderRadius: 14, padding: 10, marginBottom: 2, minWidth: 148 }, productImageWrap: { height: 125, borderRadius: 10, backgroundColor: '#e9e4d8', overflow: 'hidden', marginBottom: 10 }, productImage: { width: '100%', height: '100%' }, productCategory: { position: 'absolute', left: 7, bottom: 7, backgroundColor: 'rgba(255,249,237,0.9)', color: COLORS.ink, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5, fontSize: 9, fontWeight: '800' }, productName: { color: COLORS.ink, fontSize: 14, fontWeight: '800', minHeight: 35 }, productDetail: { color: COLORS.muted, fontSize: 11, marginTop: 1 }, productBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }, price: { color: COLORS.ink, fontSize: 15, fontWeight: '800' }, oldPrice: { color: COLORS.muted, fontSize: 10, textDecorationLine: 'line-through' }, addButton: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: COLORS.orange, paddingHorizontal: 10, height: 32, borderRadius: 8 }, addText: { color: COLORS.cream, fontSize: 12, fontWeight: '800' }, stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 9, height: 32, paddingHorizontal: 7, borderRadius: 8, borderWidth: 1, borderColor: COLORS.line, backgroundColor: '#f7f1e5' }, quantity: { color: COLORS.ink, fontSize: 13, fontWeight: '800' }, trustRow: { flexDirection: 'row', gap: 9, borderTopWidth: 1, borderTopColor: COLORS.line, marginTop: 28, paddingTop: 22 }, trustItem: { flex: 1 }, trustTitle: { color: COLORS.ink, fontSize: 12, fontWeight: '800', marginTop: 7 }, trustCopy: { color: COLORS.muted, fontSize: 10, marginTop: 2 }, floatingCart: { position: 'absolute', left: 18, right: 18, maxWidth: 650, alignSelf: 'center', backgroundColor: COLORS.orange, borderRadius: 14, padding: 13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 6, shadowColor: '#6d3e1e', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }, floatingCartTitle: { color: COLORS.cream, fontSize: 12, fontWeight: '700' }, floatingCartTotal: { color: COLORS.cream, fontSize: 15, fontWeight: '800', marginTop: 2 }, viewCart: { flexDirection: 'row', alignItems: 'center', gap: 4 }, viewCartText: { color: COLORS.cream, fontSize: 13, fontWeight: '800' }, empty: { alignItems: 'center', padding: 45 }, emptyTitle: { color: COLORS.ink, fontSize: 18, fontWeight: '800', marginTop: 10 }, emptyCopy: { color: COLORS.muted, fontSize: 13, marginTop: 4 }, modalBackdrop: { flex: 1, backgroundColor: 'rgba(23,53,43,0.35)', justifyContent: 'flex-end' }, sheet: { backgroundColor: COLORS.paper, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18, paddingTop: 10, maxHeight: '92%' }, sheetHandle: { width: 38, height: 4, backgroundColor: '#c4c6b9', borderRadius: 3, alignSelf: 'center', marginBottom: 17 }, sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 17 }, sheetTitle: { color: COLORS.ink, fontSize: 22, fontWeight: '800' }, sheetSub: { color: COLORS.muted, fontSize: 12, marginTop: 3 }, cartEmpty: { alignItems: 'center', paddingVertical: 55 }, cartList: { maxHeight: 285 }, cartLine: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: COLORS.line }, cartImage: { width: 53, height: 53, borderRadius: 8, marginRight: 11 }, cartInfo: { flex: 1 }, cartName: { color: COLORS.ink, fontSize: 14, fontWeight: '800' }, cartDetail: { color: COLORS.muted, fontSize: 11, marginTop: 2 }, cartPrice: { color: COLORS.ink, fontSize: 13, fontWeight: '800', marginTop: 5 }, summary: { paddingTop: 15 }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 }, summaryLabel: { color: COLORS.muted, fontSize: 13 }, summaryValue: { color: COLORS.ink, fontSize: 13, fontWeight: '700' }, totalLabel: { color: COLORS.ink, fontSize: 17, fontWeight: '800' }, totalValue: { color: COLORS.ink, fontSize: 20, fontWeight: '800' }, primaryButton: { minHeight: 49, backgroundColor: COLORS.ink, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 16 }, primaryButtonText: { color: COLORS.cream, fontSize: 14, fontWeight: '800' }, checkoutTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 }, formIntro: { color: COLORS.ink, fontSize: 17, fontWeight: '800', marginBottom: 12 }, formRow: { flexDirection: 'row', gap: 10 }, fieldHalf: { flex: 1 }, fieldLabel: { color: COLORS.ink, fontSize: 12, fontWeight: '800', marginBottom: 6, marginTop: 10 }, field: { backgroundColor: COLORS.cream, borderColor: COLORS.line, borderWidth: 1, borderRadius: 9, height: 45, paddingHorizontal: 12, color: COLORS.ink, fontSize: 14 }, paymentOption: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, backgroundColor: COLORS.cream, borderWidth: 1, borderColor: COLORS.line, marginBottom: 8 }, paymentOptionActive: { borderColor: COLORS.orange, backgroundColor: '#fff1e6' }, paymentText: { flex: 1, color: COLORS.ink, fontSize: 13, fontWeight: '700' }, radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: COLORS.muted, alignItems: 'center', justifyContent: 'center' }, radioActive: { backgroundColor: COLORS.orange, borderColor: COLORS.orange }, dummyNote: { color: COLORS.muted, fontSize: 11, marginTop: 7 }, formError: { color: '#b43b2b', fontSize: 12, marginTop: 8, fontWeight: '700' }, buttonDisabled: { opacity: 0.75 }, successScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }, successIcon: { width: 82, height: 82, borderRadius: 41, backgroundColor: COLORS.yellow, alignItems: 'center', justifyContent: 'center', marginBottom: 22 }, successKicker: { color: COLORS.orange, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 }, successTitle: { color: COLORS.ink, fontSize: 29, lineHeight: 34, fontWeight: '800', textAlign: 'center', marginTop: 8 }, successCopy: { color: COLORS.muted, textAlign: 'center', fontSize: 14, lineHeight: 21, maxWidth: 350, marginTop: 12 }, orderCard: { marginTop: 28, backgroundColor: COLORS.cream, borderRadius: 14, padding: 16, width: '100%', maxWidth: 380, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, orderLabel: { color: COLORS.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1 }, orderTotal: { color: COLORS.ink, fontSize: 20, fontWeight: '800', marginTop: 4 }, orderStatus: { flexDirection: 'row', alignItems: 'center', gap: 5 }, statusText: { color: COLORS.green, fontSize: 12, fontWeight: '800' }, 
});
