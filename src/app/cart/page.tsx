"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/UserContext";
import { ShoppingBag, Meh, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    console.log("🛒 Cart updated:", cart);
  }, [cart]);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="p-4 min-h-screen">
      <Card className="p-4">
        <div className="flex justify-center items-center space-x-2 mb-6">
          <h2 className="text-3xl font-semibold">Cart</h2>
          <ShoppingBag size={30} />
        </div>

        {cart.length === 0 ? (
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              {!user ? (
                <>
                  <div className="text-xl text-center">
                    Login to see the items you added previously
                  </div>
                  <Button asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Image
                    src="https://img.icons8.com/isometric-line/300/shopping-cart.png"
                    alt="shopping-cart"
                    width={300}
                    height={300}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-2xl">Your Cart is Empty</div>
                  <Meh size={25} />
                </div>
              )}
            </div>
          </Card>
        ) : (
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {cart.map((item) => (
                <Card
                  key={item.id}
                  className="flex flex-col md:flex-row gap-4 p-4 w-full "
                >
                  <Image
                    alt={item.name}
                    src={(item.images?.[0] || "/fallback.jpg").trim()}
                    width={120}
                    height={120}
                    className="rounded-md object-cover w-[120px] h-[120px] max-sm:w-full max-sm:h-auto max-lg:w-full max-lg:h-auto"
                  />
                  <div className="flex  flex-col justify-between w-full ">
                    <div className="font-semibold text-lg">{item.name}</div>
                    <div className="flex items-center gap-3 mt-2 justify-between
                    ">
                      <div className="space-x-4">
                          <Button
                        onClick={() => decreaseQuantity(item.id)}
                        title="Decrease"
                        className="border rounded cursor-pointer h-2 w-2 px-4 py-3"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        onClick={() => increaseQuantity(item.id)}
                        title="Increase"
                        className="border h-2 w-2 px-4 py-3 rounded cursor-pointer"
                      >
                        <Plus size={14} />
                      </Button>
                      </div>
                     
                      <Button
                      variant="outline"
                      onClick={() => removeFromCart(item.id)}
                      className=" mt-2  max-sm:w-full cursor-pointer hover:text-white hover:bg-[#212121] max-sm:hidden"
                    >
                      Remove
                    </Button>

                    </div>
                    <div className="text-lg font-medium mt-2">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => removeFromCart(item.id)}
                      className=" mt-2  max-sm:w-full hover:text-white hover:bg-[#212121] cursor-pointer hidden max-sm:block"
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Price Summary */}
            <Card className="p-5 mt-6 lg:mt-0 lg:max-w-sm w-full">
              <div className="text-2xl font-semibold mb-3">Price Summary</div>
              <div className="text-lg font-medium mb-4">
                Discount: ₹{totalPrice.toFixed(2)}
              </div>
              <div className="text-lg font-medium mb-4">
                Total: ₹{totalPrice.toFixed(2)}
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={clearCart}
                  className="bg-red-600 hover:bg-red-700 cursor-pointer  text-white"
                >
                  Clear Cart
                </Button>
                <Link href="/order">
                  <Button className="w-full cursor-pointer ">Proceed to Checkout</Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CartPage;
